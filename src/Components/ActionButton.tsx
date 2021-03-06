import * as React from 'react';
import { ListenerBucket } from 'keypress-tool';

interface P {
	title: string;
	onClick(ev: Event): void;
	keyPress?: ListenerBucket;
	className?: string;
}

export default class ActionButton extends React.Component<P> {

	componentDidMount() {
		let p = this.props;
		if (p.keyPress) {
			p.keyPress.addListener(p.onClick, true);
		}
	}

	componentWillUnmount() {
		let p = this.props;
		if (p.keyPress) {
			p.keyPress.removeListener(p.onClick);
		}
	}

	handleClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
		this.props.onClick(ev.nativeEvent);
	}

	render() {
		let p = this.props;
		return <button onClick={this.handleClick} className={p.className} title={`${p.title}${p.keyPress ? ' (' + p.keyPress + ')' : ''}`}>{p.title}</button>;
	}

}