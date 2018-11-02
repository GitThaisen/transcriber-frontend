/**
 * @file Google Cloud function
 * @author Andreas Schjønhaug
 */

import * as functions from "firebase-functions"
import database from "./database"
import { Status } from "./enums"
import { ITranscript } from "./interfaces"
import { saveResult } from "./persistence"
import { transcode } from "./transcoding"
import { transcribe } from "./transcription"

exports.transcription = functions
  .region("europe-west1")
  .firestore.document("users/{userId}/transcripts/{transcriptId}")
  .onCreate(async (documentSnapshot, eventContext) => {
    const id = documentSnapshot.id

    console.log(`Deployed 10:43 - Start transcription of id: ${id}`)

    try {
      // Because of indempotency, we need to fetch the transcript from the server and check if it's already in process
      const status = await database.getStatus(id)
      if (status !== Status.Analysing) {
        console.warn("Transcript already processed, returning")
        return
      }

      const transcript = documentSnapshot.data() as ITranscript

      if (transcript === undefined) {
        throw Error("Transcript missing")
      }

      const languageCode = transcript.languageCode

      // 1. Transcode

      await database.setStatus(id, Status.Transcoding)
      const gcsUri = await transcode(id)

      // 2. Transcribe

      await database.setStatus(id, Status.Transcribing)
      const speechRecognitionResults = await transcribe(id, gcsUri, languageCode)

      // 3. Save transcription

      await database.setStatus(id, Status.Saving)
      await saveResult(speechRecognitionResults, id)

      // 4. Done

      await database.setStatus(id, Status.Success)
      console.log("End transcribing with id: ", id)
    } catch (error) {
      console.log("Error in main function")
      console.error(error)

      await database.errorOccured(id, error)

      throw error
    }
  })

process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  console.error(new Error(`Unhandled Rejection at: Promise: ${promise} with reason: ${reason.stack || reason}`))
})
