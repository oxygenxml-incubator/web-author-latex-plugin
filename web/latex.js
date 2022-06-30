(function() {
  var config = {
    extensions : [ "tex2jax.js", "TeX/AMSmath.js", "TeX/AMSsymbols.js" ],
    jax : [ "input/TeX", "output/HTML-CSS" ],
    tex2jax : {
      processEscapes : true,
    },
    "HTML-CSS": {
      imageFont: null
    },
    messageStyle : "none",
    showMathMenu : false,
  };

  var translationSet = {
      LATEX_EDITOR_: {
        "en_US": "LaTeX Editor",
        "de_DE": "LaTeX Editor",
        "fr_FR": "Éditeur LaTeX",
        "ja_JP": "LaTeX エディタ",
        "nl_NL": "LaTeX-editor"
      }
  };
  sync.Translation.addTranslations(translationSet);
  
  /**
   * Callbacks to be executed when MathJax loads.
   */
  var loadCallbacks_ = [];
  /**
   * Flags set when the MathJax script is added to DOM.
   */
  var scriptAdded = false;
  /**
   * Flag set when the script is loaded.
   */
  var scriptLoaded = false;

  /**
   * Invokes the callback after ensuring the MathJax library is loaded.
   * 
   * @param callback
   *          The callback.
   */
  function loadMathJax(callback) {
    if (!scriptAdded) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "../plugin-resources/latex/MathJax-2.6/MathJax.js";

      script.text =
          'MathJax.Hub.Config(' + JSON.stringify(config) + ');'
          + 'MathJax.Hub.Config({tex2jax: {inlineMath:[["$","$"],["\\(","\\)"]]}});';

      script.onload = function() {
        scriptLoaded = true;
        loadCallbacks_.forEach(function(cb) {
          cb();
        });
      };
      document.getElementsByTagName("head")[0].appendChild(script);
      scriptAdded = true;
    }

    if (scriptLoaded) {
      callback();
    } else {
      loadCallbacks_.push(callback);
    }
  }

  /**
   * Renders an equation.
   * 
   * @param latexString
   *          The latex string.
   * @param callback
   *          A callback that receives the rendered equation as an HTML node.
   */
  function renderEquation(latexString, callback) {
    var buffer = document.createElement('span');
    buffer.textContent = '$' + latexString + '$';

    loadMathJax(function() {
      MathJax.Hub.queue.Push(function() {
        MathJax.Hub.Typeset(buffer, function() {
          callback(buffer);
        });
      });
    })
  }

  /**
   * Launches the equation editor.
   * 
   * @param latexEq
   *          The latex equation.
   * @param callback
   *          The callback that receives the edited equation.
   */
  function editEquation(latexEq, callback) {
    var editDialog = workspace.createDialog();
    var dialogContent = editDialog.getElement();
    var textarea = document.createElement('textarea');
    textarea.id = 'latex-edit-area';
    dialogContent.appendChild(textarea)
    
    var label= document.createElement('div');
    label.textContent = tr(msgs.PREVIEW_);
    dialogContent.appendChild(label);
    
    var preview = document.createElement('div');
    preview.id = 'latex-preview';
    dialogContent.appendChild(preview)
    
    editDialog.setTitle(tr(msgs.LATEX_EDITOR_));
    editDialog.setResizable(true);
    editDialog.setPreferredSize(500, 500);
    textarea.value = latexEq;
    function updatePreview() {
      renderEquation(textarea.value, function(renderedEq) {
        preview.innerHTML = '';
        preview.appendChild(renderedEq);
      })
    }
    updatePreview();
    textarea.addEventListener('input', updatePreview);
    editDialog.onSelect(function(key) {
      if (key === 'ok') {
        callback(textarea.value);
      }
      editDialog.dispose();
    });
    editDialog.show();
  }

  /**
   * Form control to render Latex equations.
   */
  LatexEnhancer = function(element, editor) {
    this.actionsManager = editor.getActionsManager();
    sync.formctrls.Enhancer.call(this, element, editor);
  };
  goog.inherits(LatexEnhancer, sync.formctrls.Enhancer);

  /**
   * Callback when the form control is inserted in the live DOM.
   */
  LatexEnhancer.prototype.enterDocument = function(controller) {
    var latexWrapper = this.formControl.firstChild;
    var latexEq = goog.dom.dataset.get(latexWrapper, 'latex');
    renderEquation(latexEq, function(renderedEq) {
      latexWrapper.innerHTML = '';
      latexWrapper.appendChild(renderedEq);
    })
    if ('true' !== goog.dom.dataset.get(latexWrapper, 'ro')) {
      this.formControl.addEventListener('click', goog.bind(this.beginEditing,
          this));
    }
  }

  /**
   * Starts the equation editing.
   */
  LatexEnhancer.prototype.beginEditing = function() {
    var latexWrapper = this.formControl.firstChild;
    var latexEq = goog.dom.dataset.get(latexWrapper, 'latex');
    var actionsManager = this.actionsManager;
    var xmlNode = this.getParentNode();

    editEquation(
        latexEq,
        function(editedEquation) {
          var sel = sync.api.Selection.createAroundNode(xmlNode);
          actionsManager.invokeOperation(
            'ReplaceElementContentOperation',
            {fragment : editedEquation}, 
            function() {}, 
            sel);
        });
  }

  sync.util.loadCSSFile('../plugin-resources/latex/latex.css');

  // Register the form-control renderer with the opened editors.
  goog.events.listen(workspace, sync.api.Workspace.EventType.BEFORE_EDITOR_LOADED, function(e) {
    e.editor.registerEnhancer(
        'com.oxygenxml.webapp.latex.WebappLatexRenderer', LatexEnhancer);
  });
})();
