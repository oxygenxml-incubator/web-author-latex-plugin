package com.oxygenxml.webapp.latex;

import java.io.IOException;
import java.io.Writer;

import javax.swing.text.BadLocationException;

import ro.sync.ecss.extensions.api.editor.AuthorInplaceContext;
import ro.sync.ecss.extensions.api.node.AuthorElement;
import ro.sync.ecss.extensions.api.webapp.formcontrols.WebappFormControlRenderer;
import ro.sync.exml.workspace.api.PluginWorkspace;
import ro.sync.exml.workspace.api.PluginWorkspaceProvider;
import ro.sync.exml.workspace.api.util.XMLUtilAccess;

/**
 * Form control renderer that renders a Latex equation as a form control 
 * to be enhanced client-side.
 *
 * @author cristi_talau
 */
public class WebappLatexRenderer extends WebappFormControlRenderer {
  /**
   * Render control.
   * 
   * @param context
   *          The context of the form control.
   * @param out
   *          The output stream.
   * 
   * @throws IOException
   *           If the form control could not be redered.
   */
  @Override
  public void renderControl(AuthorInplaceContext context, Writer out)
      throws IOException {
    PluginWorkspace pluginWorkspace = PluginWorkspaceProvider.getPluginWorkspace();
    XMLUtilAccess xmlUtil = pluginWorkspace.getXMLUtilAccess();
    AuthorElement latexElement = context.getElem();
    try {
      String latexText = latexElement.getTextContent();
      out.append("<span")
        .append(" data-latex=\"").append(xmlUtil.escapeAttributeValue(latexText)).append('"')
        .append(context.isReadOnlyContext() ? " data-ro=\"true\"" : "")
        .append(">...</span>");
    } catch (BadLocationException e) {
      throw new IOException(e);
    }
  }
  
  /**
   * The client-side rendering supported being wrapped in marker spans.
   */
  @Override
  public boolean isChangeTrackingAware() {
    return true;
  }

  /**
   * @return Returns the description of the renderer.
   */
  @Override
  public String getDescription() {
    return "Latex form control renderer";
  }
}
