import Constants from 'expo-constants'

let BackgroundTask = null
let TaskManager = null
let taskDefined = false

const TASK_NAME = 'offline-refresh-task'

function loadModules() {
  if (!BackgroundTask) BackgroundTask = require('expo-background-task')
  if (!TaskManager) TaskManager = require('expo-task-manager')
}

function ensureTaskDefined() {
  if (taskDefined) return
  loadModules()
  TaskManager.defineTask(TASK_NAME, async () => {
    try {
      // TODO: fetch new articles and store minimal data in AsyncStorage
      return BackgroundTask.BackgroundTaskResult.Success
    } catch (e) {
      return BackgroundTask.BackgroundTaskResult.Failed
    }
  })
  taskDefined = true
}

export async function registerBackgroundFetchAsync() {
  try {
    // Skip in Expo Go; background fetch APIs are not available there
    if (Constants?.appOwnership === 'expo') {
      if (__DEV__) console.log('[bg] Skipping background registration in Expo Go')
      return false
    }
    ensureTaskDefined()
    const status = await BackgroundTask.getStatusAsync()
    if (status === BackgroundTask.BackgroundTaskStatus.Restricted) return false
    await BackgroundTask.registerTaskAsync(TASK_NAME, {
      minimumInterval: 15, // minutes; Android only, iOS decides when to run after min interval
      stopOnTerminate: false,
      startOnBoot: true,
    })
    return true
  } catch (e) {
    return false
  }
}

export async function unregisterBackgroundFetchAsync() {
  try {
    if (Constants?.appOwnership === 'expo') return true
    loadModules()
    await BackgroundTask.unregisterTaskAsync(TASK_NAME)
    return true
  } catch (e) {
    return false
  }
}
