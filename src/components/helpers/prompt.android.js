import prompt from 'react-native-prompt-android'

export default function devPrompt(message) {
  console.log('message', message)
  return new Promise((resolve, reject) => {
    try {
      resolve(prompt(message, null, [{ text: 'OK', onPress: input => resolve(input) }], {
      type: 'plain-text',
      cancelable: false,
    }))
    } catch (error) {
      console.warn(error)
    }
  })
}
