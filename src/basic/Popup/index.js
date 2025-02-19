import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, Dimensions } from 'react-native'

const WIDTH = Dimensions.get('screen').width
const HEIGHT = Dimensions.get('screen').height

class Popup extends Component {
	static popupInstance

	static show({ ...config }) {
		this.popupInstance.start(config)
	}

	static hide() {
		this.popupInstance.hidePopup()
	}

	state = {
		positionView: new Animated.Value(HEIGHT),
		opacity: new Animated.Value(0),
		positionPopup: new Animated.Value(HEIGHT),
		popupHeight: 0
	}

	start({ ...config }) {
		this.setState({
			title: config.title,
			type: config.type,
			icon: config.icon !== undefined ? config.icon : false,
			textBody: config.textBody,
			button: config.button !== undefined ? config.button : true,
			button2: config.button2 !== undefined ? config.button2 : false,
			buttonText: config.buttonText || 'Ok',
			buttonText2: config.buttonText2 || 'No',
			callback: config.callback !== undefined ? config.callback : this.defaultCallback(),
			callback2: config.callback2 !== undefined ? config.callback2 : this.defaultCallback(),
			background: config.background || 'rgba(0, 0, 0, 0.5)',
			timing: config.timing,
			autoClose: config.autoClose !== undefined ? config.autoClose : false
		})

		Animated.sequence([
			Animated.timing(this.state.positionView, {
				toValue: 0,
				duration: 100,
				useNativeDriver: false
			}),
			Animated.timing(this.state.opacity, {
				toValue: 1,
				duration: 300,
				useNativeDriver: false
			}),
			Animated.spring(this.state.positionPopup, {
				toValue: (HEIGHT / 2) - (this.state.popupHeight / 2),
				bounciness: 15,
				useNativeDriver: false
			})
		]).start()

		if (config.autoClose && config.timing !== 0) {
			const duration = config.timing > 0 ? config.timing : 5000
			setTimeout(() => {
				this.hidePopup()
			}, duration)
		}
	}

	hidePopup() {
		Animated.sequence([
			Animated.timing(this.state.positionPopup, {
				toValue: HEIGHT,
				duration: 250,
				useNativeDriver: false
			}),
			Animated.timing(this.state.opacity, {
				toValue: 0,
				duration: 300,
				useNativeDriver: false
			}),
			Animated.timing(this.state.positionView, {
				toValue: HEIGHT,
				duration: 100,
				useNativeDriver: false
			})
		]).start()
	}

	defaultCallback() {
	console.log('default callback')
	}

	handleImage(type) {
		switch (type) {
			case 'Success': return require('../../assets/Success.png')
			case 'Danger': return require('../../assets/Error.png')
			case 'Warning': return require('../../assets/Warning.png')
		}
	}

	render() {
			
		const { title, type, textBody, button, buttonText, callback, background,callback2,buttonText2 } = this.state
		let el = null;
		if (this.state.button) {
			if (!this.state.button2) {
			el = <TouchableOpacity style={[styles.Button, styles[type]]} onPress={callback}>
				<Text style={[styles.TextButton,{color:  type==='Success'?'#fff':'#333'}]}>{buttonText}</Text>
			</TouchableOpacity>
			}
			else{
				el = <View style={styles.TwoButtonView}><TouchableOpacity style={[styles.Button, styles[type]]} onPress={callback}>
				<Text style={[styles.TextButton,{color:  type==='Success'?'#fff':'#333'}]}>{buttonText}</Text>
				</TouchableOpacity><TouchableOpacity style={[styles.Button, styles[type],{backgroundColor:'#fdebeb'}]} onPress={callback2}>
				<Text style={[styles.TextButton,{color:  type==='Success'?'#fff':'#333'}]}>{buttonText2}</Text>
				</TouchableOpacity></View>
			}
		}
		else {
			el = <Text></Text>
		}
		return (
			<Animated.View
				ref={c => this._root = c}
				style={[styles.Container, {
					backgroundColor: background || 'transparent',
					opacity: this.state.opacity,
					transform: [
						{ translateY: this.state.positionView }
					]
				}]}>
				<Animated.View
					onLayout={event => {
						this.setState({ popupHeight: event.nativeEvent.layout.height })
					}}
					style={[styles.Message, {
						transform: [
							{ translateY: this.state.positionPopup }
						]
					}]}
				>
					<View style={styles.Header} />
					{
						this.state.icon ? (this.state.icon) :
							<Image
								source={this.handleImage(type)}
								resizeMode="contain"
								style={styles.Image}
							/>
					}
					<View style={styles.Content}>
						<Text style={styles.Title}>{title}</Text>
						<Text style={styles.Desc}>{textBody}</Text>
						{el}
					</View>
				</Animated.View>
			</Animated.View>
		)
	}
}

const styles = StyleSheet.create({
	Container: {
		position: 'absolute',
		zIndex: 99999,
		width: WIDTH,
		height: HEIGHT,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		alignItems: 'center',
		top: 0,
		left: 0,

	},
	Message: {
		maxWidth: 350,
		minWidth: 200,
		// maxHeight: 2500,
		backgroundColor: '#fff',
		borderRadius: 4,
		alignItems: 'center',
		overflow: 'hidden',
		position: 'absolute',
		padding:16

	},
	Content: {
		// padding: 20,
		marginTop:8,
		alignItems: 'center',

	},
	Header: {
		// height: 230,
		// width: 230,
		// backgroundColor: '#FBFBFB',
		borderRadius: 100,
		// marginTop: -120
	},
	Image: {
		width: 150,
		height: 80,
		position: 'absolute',
		top: 20
	},
	Title: {
		fontWeight: 'bold',
		fontSize: 18,
		color: '#333'
	},
	Desc: {
		textAlign: 'center',
		color: '#666',
		marginTop: 10
	},
	Button: {
		borderRadius: 50,
		height: 40,
		width: 130,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 30,
		marginHorizontal:10
	},
	TextButton: {

		fontWeight: 'bold'
	},
	Success: {
		backgroundColor: '#4ABECE',
		borderRadius:8,
		color:'#fff'
	},
	Danger: {
		backgroundColor: '#fdebeb',
		borderWidth:1,
		borderRadius:8,
		borderColor:'#f89b9b',
	},
	TwoButtonView:{
		flex:1,
		flexDirection:'row',
		justifyContent:'space-between'
	},
	Warning: {
		backgroundColor: '#fbd10d',
		
	}
})

export default Popup
