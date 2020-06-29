import React from 'react';
import '../style/FaceComponent.css'
import * as faceapi from 'face-api.js'
import SpeechComponent from './SpeechComponent'

class FaceComponent extends React.Component {
	constructor() {
		super()
		this.state = {
			showVideo: false,
			expression: ''
		}
		this.handleMessage = this.handleMessage.bind(this);
	}

	componentDidMount() {
		this.loadModels(); // se apelează funcția pentru incărcare după randarea componentei
	}

	handleMessage(expression) {
		this.setState({expression})
	}

	loadModels = () => { // încărcarea modelelor necesare pentru algoritmul 
		Promise.all([ // de recunoaștere facială și a expresiilor faciale
			faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
			faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
			faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
			faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
			faceapi.nets.faceExpressionNet.loadFromUri('/models')
		]).then(this.startVideo());
	}

	videoRef = React.createRef(); // se crează rerefrința pentru video

	startVideo() { // funcție menită să afișeze semnalul video venit de la webcam
		navigator.getUserMedia({ video: {} },
			stream => this.videoRef.current.srcObject = stream,
			error => console.error(error)
		)
	}

	faceRecognition = () => { 
		const canvas = faceapi.createCanvasFromMedia(this.videoRef.current)// creare canvas pentru recunoașterea facială
		this.videoRef.current.append(canvas)
		const displaySize = { width: this.videoRef.current.width, height: this.videoRef.current.height }
		faceapi.matchDimensions(canvas, displaySize)
		setInterval(async () => { 
			document.body.append(canvas) // adăugare canvas ca element pentru a fi vizibil
			const detections = await faceapi.detectAllFaces(this.videoRef.current, //obiect ce conține toate informațiile 
				new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()// generate de algoritm
			const resizedDetections = faceapi.resizeResults(detections, displaySize)
			canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height) // curățarea canvas-ului
			faceapi.draw.drawDetections(canvas, resizedDetections); // evidențierea liniilor feței
			faceapi.draw.drawFaceLandmarks(canvas, resizedDetections); // desenarea punctelor pe față
			faceapi.draw.drawFaceExpressions(canvas, resizedDetections) // desenarea expresiilor faciale
		}, 100)


		setInterval( async () => { // funcție folosită pentru detectarea expresiilor faciale la un interval de 5 secunde
			const detections = await faceapi.detectAllFaces(this.videoRef.current, //obiect ce conține toate informațiile generate de algoritm
				new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
			detections[0] !== undefined && this.setState({expression: detections[0].expressions})
		}, 5000);
	}

	render() {
		return (
			<div className="face-container">
				<SpeechComponent messages = {this.state.expression}/>
				<video onClick={this.faceRecognition} ref={this.videoRef} className="video" width="720" height="520" autoPlay></video>
			</div>
		)
	}
}

export default FaceComponent;