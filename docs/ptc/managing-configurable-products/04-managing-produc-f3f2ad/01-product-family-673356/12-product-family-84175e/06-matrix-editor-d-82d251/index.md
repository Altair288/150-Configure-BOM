# Matrix Editor Details Pane

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodfamily/ProdFamilyMatrixEditorInformationPane.html)  
> 获取日期：2026-11-12

<a id="wwID0EJ5NU"></a>

<a id="wwID0E15NU"></a>

The Product Family Matrix Editor details pane allows you to manage and view detailed information about the objects or parts that you have selected in the Matrix Editor. The tabs are displayed dynamically, depending on the object type that you have selected.

<table border="1">
              <tr>
                <th>
                  <div id="wwID0E66NU">Tab</div>
                </th>
                <th>
                  <div id="wwID0ELAOU">Description</div>
                </th>
              </tr>
              <tr>
                <td>
                  <div id="wwID0E5AOU"><span>Attributes</span></div>
                </td>
                <td>
                  <div id="wwID0EMBOU">Provides standard attribute information (part attributes and usage attributes) about the selected object.</div>
                  <div id="wwID0EECOU"><span><span>• </span></span>Displays the part master attributes and usage attributes when you select a part master in the configurable structure or within the Matrix area when multiple variant baselines are displayed.</div>
                  <div id="wwID0EGDOU"><span><span>• </span></span>Displays the information for module variant master or module variant version when it is selected in the Product Structure tree or Matrix area cell.</div>
                  <div id="wwID0EIEOU"><span><span>• </span></span>When using multiple variant baselines, when you select a revision row in the Product Structure tree or the Matrix area cells, this tab displays the part version attribute for the selected module variant.</div>
                  <div id="wwID0EKFOU"><span><span>• </span></span>Displays the floating baseline member attributes if the revision is associated with a particular variant baseline.</div>
                  <div id="wwID0E3FOU">For more information, see <span><a href="https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodstructure/PMAttributesTab.html#wwID0EMYDM">Attributes Tab</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EWGOU"><span>Uses</span></div>
                </td>
                <td>
                  <div id="wwID0EEHOU">Allows you to insert new and existing parts and modifying attributes on the parent/child association between parts. For more information, see <span><a href="https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodstructure/PMUsesTab.html">Uses Tab</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0E4HOU"><span>Occurrences</span></div>
                </td>
                <td>
                  <div id="wwID0ELIOU">Allows you to create and edit uses occurrences of a configurable part structure. For more information, see <span><a href="https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodstructure/PMOccurrencesTab.html#wwID0EQPEM">Occurrences tab</a></span>.</div>
                  <div>
                    <table>
                      <tr>
                        <td>
                          <div id="wwID0EHJOU"><span><img src="../../../../../images/6652ad397dd1_note_16x16.png" alt="*" width="16" height="16" /></span> </div>
                        </td>
                        <td>
                          <div id="wwID0EQJOU">This tab is unavailable if you select part master in the configurable part structure tree.</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0E5JOU"><span>Option Filter</span></div>
                </td>
                <td>
                  <div id="wwID0ELKOU">Displays the selection of option filter for the variant specification. For more information, see <span><a href="../../10-managing-vari-9babf126/05-filtering-opt-d8d3f1c7/index.md#wwID0ERCAU">Filtering Options for a Managed Variant Specification</a></span></div>
                  <div id="wwID0EZKOU">This tab appears only if you have selected a cell in the matrix area. It is hidden if you have selected cells in two or more variant specification columns.</div>
                  <div id="wwID0E4KOU">The <span>Selected Choices</span> table in this tab displays the choices for the option filter that you specified for the variant specification. This table displays the <span>Selected Choices</span> information for module variant master or module variant version when it is selected in the matrix area cell.</div><div><div id="wwID0EKLOU">Click the <span>Edit Option Filter</span> icon <img src="../../../../../images/f221cf12e6d2_Edit.jpg" alt="" /> in this table. This opens the <span>Edit Option Filter</span> window, where you can define or modify the choices for a variant specification. Click <span>OK</span> in this window to reflect the changes that you made to the variant specification option filter.</div></div><div id="wwID0EDMOU">After you modify the module selection rules, the system selectively updates the Matrix Editor. That is, only the variant specifications column, for which the option filter or selection rules are changed, is refreshed to display updated information.</div><div id="wwID0EHMOU">When you update the option filter, manual selection rules, or both, the variant specification is automatically checked out and is automatically checked in again.</div></td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EWMOU"><span>Modules</span></div>
                </td>
                <td>
                  <div id="wwID0EENOU">Allows you to specify whether selections for configurable modules and module variants are based on assigned expression evaluation or based on manual selections that you make. For more information, see <span><a href="../../10-managing-vari-9babf126/03-configuring-m-2e9ec866/index.md#wwID0E5G6T">Configuring Managed Variant Specifications</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0E5NOU"><span>Plan Activities</span></div>
                </td>
                <td>
                  <div id="wwID0EMOOU">Lists any deliverable activities associated with the object. For more information, see <span><a href="https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/planmgmt/PlanMgmtPlanActivityTable.html">Plan Activities Table</a></span>.</div>
                  <div id="wwID0E1OOU">This tab displays the information for module variant master or module variant revision row when it is selected in the product structure tree or matrix area cell.</div>
                </td>
              </tr>
            </table>
