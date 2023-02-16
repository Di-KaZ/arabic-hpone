import {get, writable} from "svelte/store";

// @ts-ignore
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
// @ts-ignore
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
// @ts-ignore
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

export const synth = window.speechSynthesis;
const recongnition = new SpeechRecognition();


function startRecognition() {
	recongnition.lang = synth.getVoices()[get(selectedVoiceIndex)].lang;
	recongnition.onresult = (event) => {
		const text = event.results[0][0].transcript;
		addRecognition(text)
		recongnition.stop()
		startPhone();
	}
	recongnition.onspeechend = () => {
		recongnition.stop()
	}
	recongnition.start()
}


export const text = writable<string>('')
export const selectedVoiceIndex = writable<number>(0)

export const textList = writable<string[]>([])


function addRecognition(text: string) {
	textList.update(value => [...value, text])
}


export function setVoice(index: number) {
	selectedVoiceIndex.set(index);
}


function speak() {
	if (synth.speaking) {
		new Notification('already speaking wait')
		return
	}
	if (get(text) === '') {
		new Notification('no text...')
		return
	}
	const texts = get(textList);
	const utter = new SpeechSynthesisUtterance(texts[texts.length -1]);

	utter.onend = () => console.log('end');

	utter.onerror = () => console.log('err');

	utter.voice = synth.getVoices()[get(selectedVoiceIndex)];
	synth.speak(utter);
}

const loopIndex = writable<number>(0);

export async function startPhone() {
	console.log(get(loopIndex))
	if (get(loopIndex) > 10) return;
	loopIndex.update(value => value + 1);
	await new Promise((resolve) => setTimeout(resolve, 3000));
	startRecognition();
	setTimeout(speak, 1000);
}


export async function resetAndStartPhone() {
	loopIndex.set(0)
	textList.set([get(text)]);
	await startPhone();
}
