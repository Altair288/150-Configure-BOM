# User Interface Tab of the Edit Parameter Window

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsEditParamUITab.html)  
> 获取日期：2026-11-12

<a id="wwID0E566S"></a>

<a id="wwID0EOAAT"></a>

This tab allows you to modify the property values that are used when you enter inputs for the variant specification. The next table lists the default user interface properties. You can create additional user interface properties. If a different user interface is created, additional user interface properties may be necessary.

<table border="1">
              <tr>
                <th>
                  <div id="wwID0EXBAT">Property Name</div>
                </th>
                <th>
                  <div id="wwID0EECAT">Description</div>
                </th>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EZCAT"><span>Calculation Explanation</span></div>
                </td>
                <td>
                  <div id="wwID0EJDAT">Internal Name: <span>calculationExplanation</span></div>
                  <div id="wwID0ESDAT">The “Set Parameters” step of the part configuration process may not display some input parameters to the user because their values have been determined by some other logical expression and they have been defined as “Hide When Driven”. However, these input parameters are included in the summary of input parameters.</div>
                  <div id="wwID0EWDAT"><span>Calculation Explanation</span> provides a method by which the creator of the configurable module can explain why the user did not have an opportunity to provide an answer. This explanation is displayed in the <span>Notes</span> column of the “Input Review” page.</div>
                  <div id="wwID0ECEAT">For example, in the case where the user was asked to select the desired color for the top portion of a product and then the bottom portion of the product. However, for one color of the top portion, only a single bottom portion color was available. If the user selected this color for the top portion, the system would automatically assign the color for the bottom portion. This could potentially confuse the user. <span>Calculation Explanation</span> allows you to provide a reason why the selection is limited in such a case.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EYEAT"><span>Display Radio</span></div>
                </td>
                <td>
                  <div id="wwID0EIFAT">Internal Name: <span>displayRadio</span></div>
                  <div id="wwID0ERFAT">This is a numerical value that is used to determine if a list of values will be displayed as a dropdown list or as a set of radio buttons. If the value of <span>Display Radio</span> is greater than or equal to the list of available values, they will be displayed as radio buttons. Otherwise, they will be displayed as a dropdown list.</div>
                  <div>
                    <table>
                      <tr>
                        <td>
                          <div id="wwID0EHGAT"><span><img src="../../../../../../images/6652ad397dd1_note_16x16.png" alt="*" width="16" height="16" /></span> </div>
                        </td>
                        <td>
                          <div id="wwID0ELGAT">Boolean parameters are always displayed as radio buttons.</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0E4GAT"><span>Explanation</span></div>
                </td>
                <td>
                  <div id="wwID0ENHAT">Internal Name: <span>explanation</span></div>
                  <div id="wwID0EWHAT">Optional explanation of the parameter that appears in the “Set Parameters” step of the part configuration process.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EJIAT"><span>Format</span></div>
                </td>
                <td>
                  <div id="wwID0EZIAT">Internal Name: <span>format</span></div>
                  <div id="wwID0ECJAT">This is an expression used for formatting the values of the parameter.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0ETJAT"><span>Help URL</span></div>
                </td>
                <td>
                  <div id="wwID0EDKAT">Internal Name: <span>helpURL</span></div>
                  <div id="wwID0EMKAT">URL for the help to be used by the parameter’s input field in the “Set Parameters” step of the part configuration process.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0E4KAT"><span>Hide When Driven</span></div>
                </td>
                <td>
                  <div id="wwID0ENLAT">Internal Name: <span>hide when driven</span></div>
                  <div id="wwID0EWLAT">This Boolean specifier is applicable only to an input parameter. If it is true, the “Set Parameters” step of the part configuration process will hide this parameter when its value is driven by some constraint.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EHMAT"><span>Image Height</span></div>
                </td>
                <td>
                  <div id="wwID0EXMAT">Internal Name: <span>imageHeight</span></div>
                  <div id="wwID0EANAT">The height of the image (in pixels).</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0ERNAT"><span>Image URL</span></div>
                </td>
                <td>
                  <div id="wwID0EBOAT">Internal Name: <span>imageURL</span></div>
                  <div id="wwID0EKOAT">URL for the parameter's image. The image must be located in a subdirectory of the <span>Windchill/codebase</span> directory and is specified by using a selection tool.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EAPAT"><span>Image Width</span></div>
                </td>
                <td>
                  <div id="wwID0EQPAT">Internal Name: <span>imageWidth</span></div>
                  <div id="wwID0EZPAT">The width of the image (in pixels).</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EHQAT"><span>Multiselect</span></div>
                </td>
                <td>
                  <div id="wwID0EUQAT">Internal Name: <span>multiselect</span></div>
                  <div id="wwID0E4QAT">Controls whether multiple parameter values can be selected from the list of allowed values in the “Set Parameters” step of the part configuration process.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0ELRAT"><span>Variant Name</span></div>
                </td>
                <td>
                  <div id="wwID0EYRAT">Internal Name: <span>variant name</span></div>
                  <div id="wwID0EBSAT">Identifies the parameter as the one that drives the name of the variant.</div>
                </td>
              </tr>
            </table>
