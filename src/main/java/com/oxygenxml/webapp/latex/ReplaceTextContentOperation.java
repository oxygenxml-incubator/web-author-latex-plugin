package com.oxygenxml.webapp.latex;

import ro.sync.annotations.api.API;
import ro.sync.annotations.api.APIType;
import ro.sync.annotations.api.SourceType;
import ro.sync.ecss.extensions.api.ArgumentDescriptor;
import ro.sync.ecss.extensions.api.ArgumentsMap;
import ro.sync.ecss.extensions.api.AuthorAccess;
import ro.sync.ecss.extensions.api.AuthorDocumentController;
import ro.sync.ecss.extensions.api.AuthorOperation;
import ro.sync.ecss.extensions.api.WebappCompatible;
import ro.sync.ecss.extensions.api.node.AuthorNode;
import ro.sync.ecss.extensions.api.webapp.WebappRestSafe;

/**
 * An operation that replaces the text content of the selected element.
 */
@API(type=APIType.INTERNAL, src=SourceType.PUBLIC)
@WebappCompatible
@WebappRestSafe
public class ReplaceTextContentOperation implements AuthorOperation {
  /**
   * The name of the element.
   */
  private static final String ARGUMENT_NAME = "text";
  
  /**
   * The arguments array.
   */
  private static final ArgumentDescriptor[] ARGUMENTS = new ArgumentDescriptor[] {
    new ArgumentDescriptor(
        ARGUMENT_NAME,
        ArgumentDescriptor.TYPE_STRING,
        "The text to be inserted")
  };
  
  /**
   * @see ro.sync.ecss.extensions.api.AuthorOperation#doOperation(AuthorAccess, ArgumentsMap)
   */
  @Override
  public void doOperation(AuthorAccess authorAccess, ArgumentsMap args) {
    // Simple text replace.
    AuthorDocumentController controller = authorAccess.getDocumentController();
    AuthorNode selectedNode = authorAccess.getEditorAccess().getFullySelectedNode();
    
    controller.beginCompoundEdit();
    try {
      Object argVal = args.getArgumentValue(ARGUMENT_NAME);
      // Test if argument is a String.
      if (argVal != null && argVal instanceof String) {
        authorAccess.getDocumentController().delete(
            selectedNode.getStartOffset() + 1, 
            selectedNode.getEndOffset() - 1);
          authorAccess.getDocumentController().insertText(
              selectedNode.getStartOffset() + 1, (String) argVal);
      } else {
        throw new IllegalArgumentException("The argument value was not defined, it is " + argVal);
      }
    } finally {
      controller.endCompoundEdit();
    }
  }

  /**
   * @see ro.sync.ecss.extensions.api.AuthorOperation#getArguments()
   */
  @Override
  public ArgumentDescriptor[] getArguments() {
    return ARGUMENTS;
  }
  
  /**
   * @see ro.sync.ecss.extensions.api.AuthorOperation#getDescription()
   */
  @Override
  public String getDescription() {    
    return "Replace the text content of the selected element.";
  }
}