import admin from "firebase-admin"
import { Step, InteractionType, MicrophoneDistance, OriginalMediaType, RecordingDeviceType, AudioEncoding, Timestamp } from "./enums"

// -----------
// Transcript
// -----------

interface ITranscript {
  name?: string
  playbackUrl?: string
  process?: IProcess
  metadata?: IMetadata
  results?: Array<IResult>
  timestamps?: { [x in Timestamp]?: admin.firestore.FieldValue | admin.firestore.Timestamp }
  userId?: string
}

interface IProcess {
  error?: any
  percent?: number
  step?: Step
}

interface IMetadata {
  audioDuration?: number
  audioTopic?: string
  industryNaicsCodeOfAudio?: number
  interactionType?: InteractionType
  languageCodes?: Array<string>
  microphoneDistance?: MicrophoneDistance
  originalMediaType?: OriginalMediaType
  originalMimeType?: string
  recordingDeviceName?: string
  recordingDeviceType?: RecordingDeviceType
  speechContexts?: Array<ISpeechContext>
}

interface ISpeechContext {
  phrases: Array<string>
}

interface IResult {
  startTime: number
  confidence: number
  transcript: string
  words: Array<IWordInfo>
}

interface IWordInfo {
  word: string
  endTime: ITime
  startTime?: ITime
}

interface ITime {
  nanos: number
  seconds: string
}

interface ILongRunningRegonize {
  audio: IRecognitionAudio
  config: IRecognitionConfig
}

interface IRecognitionAudio {
  content?: string
  uri?: string
}

interface IRecognitionConfig {
  alternativeLanguageCodes?: Array<string>
  audioChannelCount?: number
  diarizationSpeakerCount?: number
  enableAutomaticPunctuation?: boolean
  enableSeparateRecognitionPerChannel?: boolean
  enableSpeakerDiarization?: boolean
  enableWordConfidence?: boolean
  enableWordTimeOffsets?: boolean
  encoding?: AudioEncoding
  languageCode: string
  maxAlternatives?: number
  metadata?: IRecognitionMetadata
  model?: string
  profanityFilter?: boolean
  sampleRateHertz?: number
  speechContexts?: Array<ISpeechContext>
  useEnhanced?: boolean
}

interface IRecognitionMetadata {
  audioTopic?: string
  industryNaicsCodeOfAudio?: number
  interactionType?: InteractionType
  microphoneDistance?: MicrophoneDistance
  originalMediaType?: OriginalMediaType
  originalMimeType?: string
  recordingDeviceName?: string
  recordingDeviceType?: RecordingDeviceType
  speechContexts?: Array<ISpeechContext>
}

// -----------
// Statistics
// -----------

interface ITranscripts {
  summaries?: Map<string, ITranscriptSummary>
  duration: number
  transcripts: number
  words: number
}

interface ITranscriptSummary {
  createdAt: admin.firestore.FieldValue
  duration: number
  languageCodes: Array<string>
  mimeType: string
  processingDuration: number
  words: number
}
