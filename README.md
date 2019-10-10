# Conduit Plugin

Base plugin for Conduit

Conduit comes with a simple plugin API. Conduit will try to load plugins from the `plugins` folder. Each plugin must be in it's own folder and contain a `package.json` file and/or an `index.js` file.

## Example
```javascript
const ConduitPlugin = require('conduit-plugin');

class MyCustomPlugin extends ConduitPlugin {
	constructor(server) {
		super(server);
	}

	onInitialized() {
		console.log('This message is from a plugin. I have hooked the `initialized` event handle! I run BEFORE the base plugin');
	}

	onBeforeChat(event) {
		event.getSender()
			.sendMessage('This message is sent via a plugin using `onBeforeChat`. This event runs before the chat packet is handled internally or by other plugins');
	}
}

module.exports = MyCustomPlugin;
```

## Plugin API
### **The plugin API docs can be found in the [Wiki](https://github.com/Conduit-MC/conduit-plugin/wiki)**