# scratch-engine
Scratch-engine is a simple and pure Javascript web component without any other dependencies. It's mainly designed for multi-language websites to change language-related text on browser-side.

## Usage
On your webpage, use
```
<script src='./static/js/scratch.js'></script>
```
to introduce scratch-engine. Then when you're ready, like the `onload` event is triggered, just simply use scratch like this
```
<body onload="engine.scratch()">
```
then the page would be rendered as expected. Scratch read the browser language by default, if you want to use multi-language, just make sure you have the corresponding language pack and use `engine.scratch(language_name)`

## Language pack
You should create a json file with the name of the language *(in lower cases)* as a language pack. The data format is `tag_name: text`. For example, you have a file named `zh-cn.js` with content as follows:
```
{
  "html_title": "你好，世界",
  "body_content": "文本内容"
}
```
And the html file is like this:
```
<html>
  <head>
    <title>{:html_title:}</title>
    <script src="./scratch.js"></script>
  </head>
  <body onload="engine.scratch()">
    {:body_content:}
  </body>
</html>
```
Then the page will be rendered as
```
<html>
  <head>
    <title>你好，世界</title>
    <script src="./scratch.js"></script>
  </head>
  <body onload="engine.scratch()">
    文本内容
  </body>
</html>
```
The language file should be placed at `./lang/language_name.js` relative to the path of scratch.js by default, but it's configurable!

## Strict mode
If disabled, scratch will use near language packs if the specific language pack is not found. Like 'en-US' for 'en-UK'. Enabled by default. Currently under development.

## Motion mode
For multi-language use. Store the original un-rendered page in `localStorage` so the page can be re-rendered to other languages when needed. Enabled by default.

## One-time settings
The scratch function is like:
```
scratch: function(lang, callback, pattern, mode){
  // Code
}
```
- `lang` is the name string of the language.
- `callback` is a callback function for those front-end frameworks with js render method to re-render DOM components.
- `pattern` defines template tag that would be replaced by scratch is a json with following pattern:
```
  {
    'prefix': '{:',
    'suffix': ':}'
  }
```
- `mode` defines several important settings, formatted as follows. Details are covered in next part:
```
  {
    'empty': '',
    'strict': true,
    'motion': true,
    'path': './lang/'
  }
```

## Extra settings
All of the settings can be configured manually by `engine.property_name[.child_property_name] = property_value` or by:
- setEmpty(str): `motion.empty` property defines what to output if no matching value is in language pack, accepts `string`
- setStrict(bool): Scratch will use only perfectly match language pack if set to true, accepts `Boolean`
- setMotion(bool, bool): The page would be stored before render if the first parameter is set to true. If the second parameter is `true`, the `localStorage` data of motion mode will be deleted, *could cause bugs*. Both accepts `Boolean`
- setPath(str): Set the path of the language packs, accepts `string`
- setPrefix(str): Set the prefix of template tag, accepts `string`
- setSuffix(str): Set the suffix of template tag, accepts `string`
- reset(): Restore default settings of scratch-engine
