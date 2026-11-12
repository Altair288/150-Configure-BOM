# Matrix Editor Configurable Module Table

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodfamily/ProdFamilyMatrixEditorPartStructureTable.html)  
> 获取日期：2026-11-12

<a id="wwID0EPGIU"></a>

<a id="wwID0EAHIU"></a>

The configurable module table displays the structure of the configurable module that is assigned to the Product Family. Within Matrix Editor, the configurable structure is displayed based on the default part configuration specification.

<a id="wwID0EFHIU"></a>

You can compare the released variant specifications with the non-released variant specifications. For the released variant specifications, the variant solution is based on the configuration specification (released configuration baseline, variant baseline if applicable, and default part configuration specification) and the option filter related to the released variant specification revision.

<a id="wwID0EKHIU"></a>

You can compare the released product variants with the non-released product variants. For the released product variants, the variant solution is based on the configuration specification (released configuration baseline, variant baseline if applicable, and latest configuration specification) and the option filter related to the latest revision of the released product variant.

> ![\*](../../../../../images/6652ad397dd1_note_16x16.png) **Note:** Some module variants may not be displayed in the configurable structure because they are not available based on the current configuration of the structure.

<a id="wwID0EKIIU"></a>

For the non-released product variants, the variant solution is based on the configuration of the configurable structure and the option filter related to the latest revision of the non-released product variant.

<a id="wwID0EPIIU"></a>

If a configurable module has been assigned to a product model that is different from the configurable module shared by the rest of the Product Family, then the variant specifications from that product model cannot be displayed in the Matrix Editor at the same time as variant specifications that inherited the Product Family’s configurable module. The selected variant specifications must share a common configurable structure so that part selections can be performed in the Matrix Editor variant specification table.

<a id="wwID0EUIIU"></a>

When you add a part revision to a variant baseline, a baseline member link is created between the part revision and the variant baseline. You can specify the soft attributes for that link, such as Status. You can edit the soft attributes of the variant baseline member link directly in this area without having to open the attributes in a separate window for editing.

<a id="wwID0EZIIU"></a>

Depending upon the number of variant baselines that you select in the Product Family structure pane, the configurable structure is displayed accordingly in the Matrix Editor variant specification table:

<a id="wwID0ESJIU"></a>

- Single variant baseline: Only one variant baseline is selected in the Matrix Editor. In this case, the entire part structure including all the lower-level parts is displayed. Since you can see the lower-level parts, you can view and edit the floating member link attributes in the configurable structure.

<a id="wwID0EUKIU"></a>

- Multiple variant baselines: In this case, more than one variant baselines are selected in the Matrix Editor. The part structure is displayed only till module variant part master. You can only view the attributes, but you cannot edit them in this case, because the attributes are displayed in the Matrix cell table and not in the configurable structure version. Master attributes can be edited for configurable modules.

<a id="wwID0EWLIU"></a>

- No variant baseline: In this case, only those variant specifications are displayed, which are not in any of the available variant baselines.

> ![\*](../../../../../images/6652ad397dd1_note_16x16.png) **Note:** Floating member link is the association between the variant baseline and module variants that are added as baseline objects.

<a id="wwID0EENIU"></a>

When working with module variant revision rows, you can add designated parts into the path filter when a revision row is selected. Path filter is a list of masters, hence you can add a selected revision row part into the path filter by letting the system add in the appropriate master.

> ![\*](../../../../../images/6652ad397dd1_note_16x16.png) **Note:** • You cannot set path filter with replacement parts. • You can apply the same path filter used in Matrix Editor (when using single, multiple, or no variant baselines) consistently from Product Structure Browser and the **Structure** tab of a variant specification.

<a id="wwID0EMQIU"></a>

The following actions are available from the configurable structure tool bar in Matrix Editor:

<table border="1">
              <tr>
                <th>
                  <div id="wwID0EPRIU"><span>Action</span></div>
                </th>
                <th>
                  <div id="wwID0E5RIU"><span>Description</span></div>
                </th>
              </tr>
              <tr>
                <td><div><div id="wwID0EUSIU"><span>Insert existing</span> <img src="../../../../../images/95a4c9475784_IconAdd.gif" alt="" /></div></div></td>
                <td>
                  <div id="wwID0EKTIU">Opens the <span>Insert Existing</span> window, from where you can select one or more existing parts to insert in the structure of a selected assembly part.</div>
                  <div id="wwID0ETTIU">For more information, see <span><a href="https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodstructure/PMChildPartAdd.html">Inserting an Existing Part</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0ENUIU"><span>Insert new</span> <img src="../../../../../images/1fd2a914f573_Exp_IconChildCreate.gif" alt="" /></div></div></td>
                <td>
                  <div id="wwID0EDVIU">Opens the <span>New Part</span> window, from where you can create and insert a new part into the structure.</div>
                  <div id="wwID0EMVIU">For more information, see <span><a href="https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/parts/PMPartCreate.html">Creating a New Part</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0EGWIU"><span>Insert multiple new</span> <img src="../../../../../images/fe5a8a4c254a_IconMultiplePartNew.gif" alt="" /></div></div></td>
                <td>
                  <div id="wwID0E3WIU">Opens the <span>New Multiple Parts</span> window, from where you can create and insert new multiple parts into the structure.</div>
                  <div id="wwID0EFXIU">For more information, see <span><a href="https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/parts/PMPartMultipleCreate.html">Creating Multiple New Parts</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0E6XIU"><span>Remove selected</span> <img src="../../../../../images/ae4a236e741a_IconRemove.gif" alt="" /></div></div></td>
                <td>
                  <div id="wwID0EVYIU">Removes the selected part from the structure.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0EEZIU"><span>Edit part</span> <img src="../../../../../images/9dbb36b32ff3_IconEdit.gif" alt="" /></div></div></td>
                <td>
                  <div id="wwID0E1ZIU">Opens the <span>Edit Part</span> window, where you can edit version-specific attributes associated with the selected part.</div>
                  <div id="wwID0ED1IU">For more information, see <span><a href="https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/parts/PMPartUpdate.html">Editing a Part</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0E41IU"><span>Edit multiple objects</span> <img src="../../../../../images/5491e66d512d_IconEditMultiObjects.gif" alt="" /></div></div></td>
                <td>
                  <div id="wwID0ET2IU">Opens the <span>Edit Multiple Parts</span> window, where you can edit version-specific attributes associated with the selected parts.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0EH3IU"><span>Edit attribute value</span> <img src="../../../../../images/9f3602cfa960_IconAttrValueEdit.gif" alt="" /></div></div></td>
                <td>
                  <div id="wwID0E43IU">Allows you to edit the usage link attribute value for the selected part.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0EM4IU"><span>Edit usage attributes</span> <img src="../../../../../images/6c605913806c_IconPartEdit.gif" alt="" /></div></div></td>
                <td>
                  <div id="wwID0EC5IU">Allows you to edit attributes on the usage link between a selected child part and the next higher assembly part.</div>
                  <div id="wwID0EG5IU">For more information, see <span><a href="https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodstructure/PMUsageAttributesEdit.html#wwID0EWVMM">Editing Usage Attributes</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EA6IU"><span>Find in Structure and Matrix</span></div>
                </td>
                <td>
                  <div id="wwID0EO6IU">Allows you to search for an object in the structure.</div>
                  <div id="wwID0ES6IU">For more information, see <span><a href="https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodstructure/PMFindInStructure.html">Find in Structure</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EMAJU"><span>Advanced</span></div>
                </td>
                <td>
                  <div id="wwID0E1AJU">Opens the <span>Advanced Find Criteria</span> window, where you can specify the attribute expressions in the <span>Attribute Query Expression</span> window to search for items within the configurable structure. You can define attribute expressions based on part version, part usage and variant baseline member attributes.</div>
                  <div id="wwID0EHBJU">For more information, see <span><a href="https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodstructure/PMFindInStructure.html#wwID0E3JBM">Find in Structure</a></span></div>
                  <div>
                    <table>
                      <tr>
                        <td>
                          <div id="wwID0ECCJU"><span><img src="../../../../../images/6652ad397dd1_note_16x16.png" alt="*" width="16" height="16" /></span> </div>
                        </td>
                        <td>
                          <div id="wwID0ELCJU">For standalone and organized variant specifications, the attribute queries containing floating baseline member attributes are ignored when Advanced search is in progress.</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0E1CJU"><img src="../../../../../images/812898d24ac4_IconCustomize.gif" alt="" /> <span>Structure views (Default)</span></div></div></td>
                <td>
                  <div id="wwID0EQDJU">Contains the following options to define or change the display of the configurable structure table:</div>
                  <div id="wwID0EIEJU"><span><span>• </span></span><span>Default</span></div>
                  <div id="wwID0EMFJU"><span><span>• </span></span><span>Save Structure View</span></div>
                  <div id="wwID0EQGJU"><span><span>• </span></span><span>Manage Structure Views</span>: Opens the <span>Customize View List: Structure Tree</span> window, where you can select a different view to display the configurable structure table.</div>
                  <div id="wwID0EIHJU">You can also create and edit new table views using the Edit action in this window. For more information, see <span><a href="https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/usersetup_personal/UserSetupTableViewNew.html">Creating and Editing New Table Views</a></span>.</div>
                </td>
              </tr>
            </table>

<a id="wwID0E4HJU"></a>

To expand or collapse a part structure node, right-click the node, click **Expand by** and select the number of levels from the list.

<a id="wwID0EHIJU"></a>

For other common actions on the tool bar, such as Copy, Paste, Check in, Check out, and so on, see [Check Out/In Action Set — Parts](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodstructure/PMActionSetCheckOutIn.html#wwID0ENPNM "Check Out/In Action Set - Parts") and [Clipboard Action Set — Parts](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodstructure/PMActionSetClipboard.html#wwID0E2GOM "Clipboard Action Set - Parts").
