var engine = {
  /*
   * Language setting
   * @notice: language pack should be placed under the same directory of scratch.js
   * file with the path like ./lang/zh-cn.json. If not, change the path in the mode setting to yout personal defined path
   *
   */
  lang: navigator.language, // Use browser default language

  /* Mode settings
   * @param empty: What to output if no matching value is in language pack
   * @param strict: Use only perfectly match language pack if set to true
   * @param motion: Set to true so the page can be rendered plenty of times
   * @param path: Path to the directory containing language packs
   *
   */
  mode: {
    'empty': '',
    'strict': true,
    'motion': true,
    'path': './lang/'
  },

  setEmpty: function(str='') {
    this.mode.empty = str;
  },

  setStrict: function(bool=true) {
    this.mode.strict = bool;
  },

  setMotion: function(bool=true, clear=false) {
    this.mode.motion = bool;

    if (clear) {
      localStorage.removeItem('motion_path');
      localStorage.removeItem('motion_stream');
    }
  },

  setPath: function(str='./lang/') {
    this.mode.path = str;
  },

  /*
   * Search pattern
   * @notice: strings matching this pattern will be replaced, if no corresponding value is in language pack, will be replaced with mode.empty
   *
   */
  pattern: {
    'prefix': '{:',
    'suffix': ':}'
  },

  setPrefix: function(str='{:') {
    this.pattern.prefix = str;
  },

  setSuffix: function(str=':}') {
    this.pattern.suffix = str;
  },

  /*
   * Reset settings to default
   *
   */
  reset: function(reset_lang=true, reset_mode=true, reset_pattern=true) {
    if (reset_lang) {
      this.lang = navigator.language;
    }

    if (reset_mode) {
      this.mode = {
        'empty': '',
        'strict': true,
        'motion': true,
        'path': './lang/'
      };
    }

    if (reset_pattern) {
      this.pattern = {
        'prefix': '{:',
        'suffix': ':}'
      };
    }
  },

  /*
   * Execute function, nice and easy
   * @notice: if you're using some kind of front-end framework, you might use callback to update DOM after scratch's render process
   *
   */
  scratch: function(lang=this.lang, callback=null, pattern=this.pattern, mode=this.mode) {
    // Get corresponding language pack
    var lang_path = mode.path + lang.toLowerCase() + '.json';
    var request = new XMLHttpRequest();
    request.open('GET', lang_path);

    // Get status code
    request.onload = function() {
      if (this.status == 404) {
        if (mode.strict) {
          console.error('Scratch: No matching language pack, exit');
          console.info('Scratch: Currently running under strict mode, you might want to change it by \'engine.setStrict(false)\'');
        }

        else if (!mode.strict) { // Under develop
          console.warn('Scratch: No matching language pack, finding other packs');
          console.error('Scratch: Function under develop, exit');
        }
        return false;
      }

      // Pack exists, ready for render
      else if (this.status == 200) {
        var data = JSON.parse(request.responseText);
        var stream = document.documentElement.innerHTML;

        // Check motion mode
        if (mode.motion) {
          console.info('Scratch: Motion mode enabled. To disable it, use \'engine.setMotion(false)\'');
          var current_path = location.pathname;

          // Page not stored before
          if (localStorage.motion_path === undefined || localStorage.motion_path != current_path) {
            localStorage.motion_path = current_path;
            localStorage.motion_stream = stream;
          }

          // Stored before
          else {
            stream = localStorage.motion_stream;
          }
        }

        // Loop for replacements
        var prev = 0,lat = 0;
        while(true) {
          // Fall back
          lat = prev;

          // Search for pattern
          prev = stream.indexOf(pattern.prefix, lat);
          lat = stream.indexOf(pattern.suffix, prev);

          // Cannot found matching values
          if (prev == -1 || lat == -1) {
            break;
          }

          // Find and replace
          var tag = stream.slice(prev + pattern.prefix.length, lat).replace(/\s+/g,''); // Remove spaces

          // Tag not in pack
          if (data[tag] === undefined) {
            stream = stream.slice(0, prev) + mode.empty + stream.slice(lat + pattern.suffix.length);
          }

          else {
            stream = stream.slice(0, prev) + data[tag] + stream.slice(lat + pattern.suffix.length);
          }
        }
        document.documentElement.innerHTML = stream; // Write back
        return true;
      }

      else {
        console.error('Scratch: HTTP error code ' + this.status + ', exit');
        return false;
      }
    }
    request.send(null); // Ajax send
    callback(); // Callback
    return true;
  }
};
