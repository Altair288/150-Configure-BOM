# Product Family Structure Tab

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodfamily/PFSBTabAbout.html)  
> 获取日期：2026-11-12

<a id="wwID0E3WZT"></a>

<a id="wwID0EMXZT"></a>

The Product Family **Structure** tab consists of the following areas:

<table border="1">
              <tr>
                <th>
                  <div id="wwID0EYYZT">Section</div>
                </th>
                <th>
                  <div id="wwID0EEZZT">Description</div>
                </th>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EWZZT">Tool bar</div>
                </td>
                <td>
                  <div id="wwID0EA1ZT">Contains actions for managing a Product Family structure.</div><div><div id="wwID0EE1ZT"><img src="../../../../../images/99eb812142c8_ProdFamilyStructureTabToolbar.jpg" alt="" /></div></div><div id="wwID0ES1ZT">For more information, see Product Family Structure Tab Actions.</div></td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EA2ZT">Product Family structure table</div>
                </td>
                <td>
                  <div id="wwID0EK2ZT">Displays the hierarchical structure of a Product Family. Use the <span>Viewing</span> actions group in the tool bar to manage the view of the structure. For information about adding members to the Product Family structure, see <span><a href="../index.md#wwID0EISZT">Creating Product Family Structures</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EI3ZT">Selected objects tabs pane</div>
                </td>
                <td>
                  <div id="wwID0ET3ZT">Displays the <span>Attributes</span> tab of the object selected in the Product Family structure table. If <span>2-Pane Display</span> is selected, then additional tabs for the object are layered after the <span>Attributes</span> tab.</div>
                </td>
              </tr>
              <tr>
                <td rowspan="3">
                  <div id="wwID0EQ4ZT">Additional tabs pane</div>
                </td>
                <td>
                  <div id="wwID0E24ZT">When <span>3-Pane Display</span> is selected, this pane displays at the bottom of the page. If the selected object in the Product Family structure table has additional tabs aside from <span>Attributes</span>, then they are displayed in this pane.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0ET5ZT">When a variant specification is selected, the <span>Option Filter</span> tab displays. For more information on this tab, see <span><a href="../../12-product-family-84175e/06-matrix-editor-d-82d251/index.md#wwID0EJ5NU">Matrix Editor Details Pane</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0ER6ZT">When a variant baseline is selected, the <span>Baseline Objects</span> tab displays. For more information, see <span><a href="../../11-variant-baselines/08-baseline-objects-table/index.md#wwID0EXCEU">Baseline Objects Table</a></span>.</div>
                </td>
              </tr>
            </table>

<a id="wwID0EPA1T"></a>

## Product Family Structure Tab Actions

<a id="wwID0ETA1T"></a>

Actions for managing a Product Family structure are available from the Product Family **Structure** tab **Actions** menu, tool bar, or right-click action menu on a Product Family object. For a description of common Windchill actions, see [Actions Common Among Objects](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/commonactions/CommonActionsRef.html).

<a id="wwID0EVB1T"></a>

The following actions are particularly useful for managing a Product Family structure:

<table border="1">
              <tr>
                <th>
                  <div id="wwID0EDD1T">Actions Group</div>
                </th>
                <th>
                  <div id="wwID0EPD1T">Icon</div>
                </th>
                <th>
                  <div id="wwID0E2D1T">Action Name</div>
                </th>
                <th>
                  <div id="wwID0EHE1T">Description</div>
                </th>
              </tr>
              <tr>
                <td rowspan="4">
                  <div id="wwID0E2E1T"><span>Editing</span></div>
                </td>
                <td><div><div id="wwID0EEF1T"><img src="../../../../../images/9a198c927f5e_IconNew.gif" alt="" /></div></div></td>
                <td>
                  <div id="wwID0EYF1T"><span>Insert New</span></div>
                </td>
                <td>
                  <div id="wwID0EGG1T">Adds a node to the structure. The <span>Insert New Product Family Member</span> opens to create valid objects for the selected position within the structure.</div>
                  <div id="wwID0EPG1T">For more information, see <span><a href="02-insert-new-pr-d9b5fbb4/index.md#wwID0EJE4T">Insert New Product Family Member</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0EDH1T"><img src="../../../../../images/95a4c9475784_IconAdd.gif" alt="" /></div></div></td>
                <td>
                  <div id="wwID0EXH1T"><span>Insert Existing</span></div>
                </td>
                <td>
                  <div id="wwID0EFI1T">Opens the <span>Insert Existing</span> window, where you can insert a product model group, product model, or variant specification.</div>
                  <div id="wwID0EOI1T">Using this action, you can insert an existing stand-alone variant specification to a product model. As a result, the variant specification becomes an organized variant specification that you can organize within the Product Family.</div>
                  <div>
                    <table>
                      <tr>
                        <td>
                          <div id="wwID0E6I1T"><span><img src="../../../../../images/6652ad397dd1_note_16x16.png" alt="*" width="16" height="16" /></span> </div>
                        </td>
                        <td>
                          <div id="wwID0EAK1T"><span><span>• </span></span>A stand-alone variant specification exists outside of a Product Family structure. A variant specification that is created using the Configure action is an example of a stand-alone variant specification.</div>
                          <div id="wwID0ECL1T"><span><span>• </span></span>To be able to insert an existing stand-alone variant specification to a product model, you must have the “Modify” permission.</div>
                          <div id="wwID0EEM1T"><span><span>• </span></span>You cannot add a checked out variant specification to a product model.</div>
                          <div id="wwID0EGN1T"><span><span>• </span></span>A variant specification must belong to only one product model.</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div id="wwID0EYN1T">For more information, see <span><a href="https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodstructure/PMChildPartAdd.html#wwID0EL6LM">Inserting an Existing Part</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0ESO1T"><img src="../../../../../images/ae4a236e741a_IconRemove.gif" alt="" /></div></div></td>
                <td>
                  <div id="wwID0EEP1T"><span>Remove</span></div>
                </td>
                <td>
                  <div id="wwID0ESP1T">Removes a product model group, product model, or variant specification from the Product Family structure. The parent Product Family member is automatically checked out, and remains checked out after the Remove action is complete. Using this action, you can remove an organized variant specification from a product model. As a result, the variant specification becomes a stand-alone variant specification and can no longer be organized within the Product Family.</div>
                  <div>
                    <table>
                      <tr>
                        <td>
                          <div id="wwID0EEQ1T"><span><img src="../../../../../images/6652ad397dd1_note_16x16.png" alt="*" width="16" height="16" /></span> </div>
                        </td>
                        <td>
                          <div id="wwID0EFR1T"><span><span>• </span></span>This action does not remove variant baselines. Variant baselines are automatically removed from a Product Family structure when it is no longer associated with a variant specification that is a member of the Product Family.</div>
                          <div id="wwID0EHS1T"><span><span>• </span></span>You cannot remove a checked out variant specification to a product model.</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0E5S1T"><img src="../../../../../images/9dbb36b32ff3_IconEdit.gif" alt="" /></div></div></td>
                <td>
                  <div id="wwID0EST1T"><span>Edit</span></div>
                </td>
                <td>
                  <div id="wwID0EAU1T">Opens the <span>Edit Product Family</span> window, where you can edit attributes (such as name and description) of a Product Family, product model group, or product model.</div>
                  <div id="wwID0EJU1T">For more information, see <span><a href="01-editing-a-pro-5cd55b03/index.md#wwID0EJ53T">Editing a Product Family Object</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td rowspan="4">
                  <div id="wwID0EEV1T"><span>Check Out/In</span></div>
                </td>
                <td></td>
                <td>
                  <div id="wwID0E5V1T"><span>Check Out</span></div>
                </td>
                <td rowspan="4">
                  <div id="wwID0ENW1T">For information on these actions, see <span><a href="https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodstructure/PMActionSetCheckOutIn.html#wwID0ENPNM">Check Out/In Action Set - Parts</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <div id="wwID0ESX1T"><span>Check In</span></div>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <div id="wwID0EPY1T"><span>Revise</span></div>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <div id="wwID0EMZ1T"><span>My Checkouts</span></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0E5Z1T"><span>Clipboard</span></div>
                </td>
                <td></td>
                <td>
                  <div id="wwID0EX11T"><span>Paste</span></div>
                </td>
                <td>
                  <div id="wwID0EF21T">Opens the <span>Paste as Copy</span> window, where you can specify objects to paste as copies of the Product Family object that you have copied to the clipboard.</div>
                  <div id="wwID0EO21T">For the Managed and Organized variant specifications, you can use this action save the existing variant specifications as new to create new variant specifications with a different type. In the <span>Paste as Copy</span> window, you can specify name and number for the new variant specification and all other attributes of the source variant specification are copied as is. You can create one or more variant specifications from one or more existing source variant specifications.</div>
                  <div id="wwID0EX21T">You can also create new variant specifications outside the Product Family from stand-alone and Organized variant specifications using the<span>Save As</span> action. However, you can use this action only for a single variant specification.</div>
                  <div id="wwID0EA31T">When you use the <span>Paste</span> or <span>Save As</span> action, the stand-alone variant specification remains stand-alone, and the organized variant specification becomes stand-alone after pasting. As a result, the Product Family reference is removed for the new stand-alone variant specification that is created from the organized variant specification. You can create new variant specifications from the existing ones by using any of the following methods:</div>
                  <div id="wwID0EB41T"><span><span>• </span></span>Copy one or more managed or organized variant specifications and paste them to a product model.</div>
                  <div id="wwID0ED51T"><span><span>• </span></span>Copy one or more stand-alone variant specifications and paste them to a folder.</div>
                  <div id="wwID0EF61T"><span><span>• </span></span>Select a stand-alone variant specification and perform the <span>Save As</span> action.</div>
                  <div>
                    <table>
                      <tr>
                        <td>
                          <div id="wwID0EIA2T"><span><img src="../../../../../images/6652ad397dd1_note_16x16.png" alt="*" width="16" height="16" /></span> </div>
                        </td>
                        <td>
                          <div id="wwID0EJB2T"><span><span>• </span></span>To create a new variant specification, you must have the appropriate Create permission.</div>
                          <div id="wwID0ELC2T"><span><span>• </span></span>The target product model where you want to paste the variant specifications to, must support the variant specification type.</div>
                          <div id="wwID0END2T"><span><span>• </span></span>The <span>Type</span> attribute for the new variant specification is read-only if only one valid variant specification type exists.</div>
                          <div id="wwID0ETE2T"><span><span>• </span></span>The Option Filter and manual selections are copied as is to the new variant specifications.</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="4">
                  <div id="wwID0ESF2T">When you remove an organized variant specification from a product model, it becomes a stand-alone variant specification.</div>
                  <div id="wwID0EWF2T">To add a stand-alone variant specification to a product model, you can use the <span>Insert New</span> action.</div>
                  <div id="wwID0E6F2T">The following actions are unavailable for the organized variant specifications:</div>
                  <div id="wwID0EXG2T"><span><span>• </span></span>Edit Option Filter</div>
                  <div id="wwID0EZH2T"><span><span>• </span></span>New Variant Baseline</div>
                  <div id="wwID0E2I2T"><span><span>• </span></span>Assign to Existing Variant Baseline</div>
                </td>
              </tr>
              <tr>
                <td rowspan="4">
                  <div id="wwID0EZJ2T"><span>Viewing</span></div>
                </td>
                <td></td>
                <td>
                  <div id="wwID0ESK2T"><span>Show</span></div>
                </td>
                <td>
                  <div id="wwID0EAL2T">Displays the information for:</div>
                  <div id="wwID0EYL2T"><span><span>• </span></span><span>Show All</span></div>
                  <div id="wwID0E3M2T"><span><span>• </span></span><span>Variant Baseline</span>: If you have added a non-latest revision of a managed variant specification to a variant baseline, then in the Show mode, the system displays that non-latest revision of the managed variant specification for the variant baseline and the latest revision of the managed variant specification under the product model. Whereas in the Hide mode, the system always displays the latest revision of the managed variant specification under the product model. This action to view or hide variant baselines is controlled by the <span>Product Family Structure Related Information</span> preference available in <span>Preference Management</span> &gt; <span>Structure</span> &gt; <span>Related Information</span>. This preference allows you to show or hide variant baselines automatically when the Product Family Structure Browser or Matrix Editor is displayed initially.</div>
                  <div id="wwID0ERO2T"><span><span>• </span></span><span>Manage Related Information</span></div>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <div id="wwID0E2P2T"><span>Hide</span></div>
                </td>
                <td>
                  <div id="wwID0EJQ2T">Hides the selected variant baseline in the Product Family structure.</div>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <div id="wwID0EDR2T"><span>Views</span></div>
                </td>
                <td>
                  <div id="wwID0ERR2T">Contains the following options to define or change the display of the Product Family structure:</div>
                  <div id="wwID0EJS2T"><span><span>• </span></span><span>Default</span></div>
                  <div id="wwID0ENT2T"><span><span>• </span></span><span>Save Structure View</span></div>
                  <div id="wwID0ERU2T"><span><span>• </span></span><span>Manage Structure Views</span>: This action opens the <span>Customize View List: Product Family Structure Tree</span> window, where you can choose a different view to display the Product Family structure. You can also create a new view using the <span>New View</span> icon in this window.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0ETV2T"><img src="../../../../../images/e20e644ed76b_IconLayoutView.gif" alt="" /></div></div></td>
                <td>
                  <div id="wwID0EHW2T"><span>Display</span></div>
                </td>
                <td>
                  <div id="wwID0EVW2T">Contains nested actions to select all nodes, refresh the structure, and expand or collapse nodes under the selected Product Family objects.</div>
                </td>
              </tr>
              <tr>
                <td rowspan="2">
                  <div id="wwID0EFX2T"><span>Configurable Module</span></div>
                </td>
                <td><div><div id="wwID0ETX2T"><img src="../../../../../images/022c4e23518c_Assign_Config_Module.jpg" alt="" /></div></div></td>
                <td>
                  <div id="wwID0EHY2T"><span>Assign</span></div>
                </td>
                <td>
                  <div id="wwID0EVY2T">Opens the <span>Assign Configurable Module</span> window, where you can assign a configurable module to a Product Family.</div>
                  <div id="wwID0E5Y2T">For more details, see <span><a href="../../09-assigning-a-c-82cd3155/index.md#wwID0ERJ4T">Assigning a Configurable Module</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0EYZ2T"><img src="../../../../../images/42f2046b7a83_Unassign_Config_Module.jpg" alt="" /></div></div></td>
                <td>
                  <div id="wwID0EM12T"><span>Un-Assign</span></div>
                </td>
                <td><div><div id="wwID0E112T">Removes a configurable module assignment to a Product Family. To do this, select the Product Family or product model in the <span>Structure</span> tab and click <img src="../../../../../images/42f2046b7a83_Unassign_Config_Module.jpg" alt="" /> <span>Un-Assign</span> .</div></div></td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0E122T"><span>Tools</span></div>
                </td>
                <td><div><div id="wwID0EI32T"><img src="../../../../../images/e179db1d4271_IconMatrixEditor.gif" alt="" /></div></div></td>
                <td>
                  <div id="wwID0E232T"><span>Matrix Editor</span></div>
                </td>
                <td>
                  <div id="wwID0EJ42T">Opens the <span>Matrix Editor</span> window, where you can view, compare, and define variant specifications in a convenient matrix user interface. Product engineers can quickly view a Product Family structure, its associated configurable module, the variant specifications that have been defined from the configurable module, and manage the choices selected for the variant specifications.</div>
                  <div id="wwID0ES42T">For more information, see <span><a href="../../12-product-family-84175e/index.md#wwID0EYIGU">Product Family Matrix Editor</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EM52T"><span>Find in Structure</span></div>
                </td>
                <td colspan="3">
                  <div id="wwID0E452T">Allows you to search for a Product Family object. For more information, see <span><a href="https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodstructure/PMFindInStructure.html#wwID0E3JBM">Find in Structure</a></span>.</div>
                </td>
              </tr>
            </table>

<a id="wwID0EV62T"></a>

## Shortcut Menu Actions

<a id="wwID0EZ62T"></a>

In addition to the actions available on the **Structure** tab tool bar, the following key actions are also available when you right-click in the Product Family structure:

<table border="1">
              <tr>
                <th>
                  <div id="wwID0EAB3T">Action</div>
                </th>
                <th>
                  <div id="wwID0EMB3T">Description</div>
                </th>
              </tr>
              <tr>
                <td>
                  <div id="wwID0E6B3T"><span>New Configuration Context</span></div>
                </td>
                <td>
                  <div id="wwID0ENC3T">Opens the <span>New Configuration Context</span> window, where you can create a configuration context on a variant specification that you can use to open in a CAD session. Any changes that you make to the variant specification are not automatically reflected within the configuration context. You can use the <span>Update Variant Specification</span> action to update the referenced variant specification to the latest version.</div>
                  <div id="wwID0E1C3T">For a configuration context that references a managed variant specification, you can edit the filter information (such as configuration specification, spatial filter, attribute filter, and custom filters) that is not referenced from the variant specification. The option filter is derived from the variant specification; hence you cannot edit it.</div>
                  <div id="wwID0E5C3T">This action is unavailable, if you have imported the variant specification using package, and if the top-level part is a supplier part.</div>
                  <div id="wwID0ECD3T">For more information, see <span><a href="https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/WorkingWithCADandPartStructures/DICAboutConfigContext.html">Configuration Context Overview</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0E3D3T"><span>Convert to Managed</span></div>
                </td>
                <td>
                  <div id="wwID0EKE3T">Converts an organized variant specification into a managed variant specification. As a result, the organized variant specification becomes a managed variant specification in the Product Family. After the conversion, the variant specification is defined by the configurable product structure inherited by the Product Family.</div>
                  <div>
                    <table>
                      <tr>
                        <td>
                          <div id="wwID0E2E3T"><span><img src="../../../../../images/6652ad397dd1_note_16x16.png" alt="*" width="16" height="16" /></span> </div>
                        </td>
                        <td>
                          <div id="wwID0E3F3T"><span><span>• </span></span>A variant specification can belong to only one product model.</div>
                          <div id="wwID0E5G3T"><span><span>• </span></span>You must have the Modify permission to perform this action.</div>
                          <div id="wwID0EAI3T"><span><span>• </span></span>You can select more than one organized variant specification for conversion.</div>
                          <div id="wwID0ECJ3T"><span><span>• </span></span>This action is unavailable for stand-alone and managed variant specifications.</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0E6J3T"><span>Edit Option Filter</span></div>
                </td>
                <td>
                  <div id="wwID0ENK3T">Opens the <span>Edit Option Filter</span> window, where you can define or modify the choices for a managed variant specification.</div>
                  <div id="wwID0EWK3T">For more information, see <span><a href="../../10-managing-vari-9babf126/05-filtering-opt-d8d3f1c7/index.md#wwID0ERCAU">Filtering Options for a Managed Variant Specification</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EQL3T"><span>Assign to New Variant Baseline</span></div>
                </td>
                <td>
                  <div id="wwID0E5L3T">Opens the <span>Assign to New Variant Baseline</span> window where you can create a variant baseline and assign the selected variant specification to that variant baseline. The system automatically populates the selected variant specification in the <span>Select Variant Specifications</span> table in the <span>Assign to New Variant Baseline</span> window.</div>
                  <div>
                    <table>
                      <tr>
                        <td>
                          <div id="wwID0E3M3T"><span><img src="../../../../../images/6652ad397dd1_note_16x16.png" alt="*" width="16" height="16" /></span> </div>
                        </td>
                        <td>
                          <div id="wwID0EFN3T">This action is available only for managed variant specifications that are not a part of any variant baseline.</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div id="wwID0EJN3T">For more information, see <span><a href="../../11-variant-baselines/02-new-variant-bas-257e32/index.md#wwID0E5FBU">New Variant Baseline Window</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EDO3T"><span>Assign to Existing Variant Baseline</span></div>
                </td>
                <td>
                  <div id="wwID0ERO3T">Opens the <span>Assign to Existing Variant Baseline</span> window, where you can search for an existing variant baseline and assign the selected managed variant specifications to it.</div>
                  <div>
                    <table>
                      <tr>
                        <td>
                          <div id="wwID0EHP3T"><span><img src="../../../../../images/6652ad397dd1_note_16x16.png" alt="*" width="16" height="16" /></span> </div>
                        </td>
                        <td>
                          <div id="wwID0EQP3T">This action is available only for managed variant specifications that are not a part of any variant baseline.</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0E6P3T"><span>Unassign from Variant Baseline</span></div>
                </td>
                <td>
                  <div id="wwID0ENQ3T">Allows you to unassign variant specifications from a variant baseline from within the Product Family structure. This action is available only for managed variant specifications.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0E3Q3T"><span>Show/Hide Related Information</span></div>
                </td>
                <td>
                  <div id="wwID0EKR3T">Allows you to display or hide the related information for:</div>
                  <div id="wwID0ECS3T"><span><span>• </span></span>Show My Related Information</div>
                  <div id="wwID0EET3T"><span><span>• </span></span>Show All</div>
                  <div id="wwID0EGU3T"><span><span>• </span></span>Hide All</div>
                  <div id="wwID0EIV3T"><span><span>• </span></span>Variant Baseline</div>
                  <div id="wwID0EKW3T"><span><span>• </span></span>Manage Related Information</div>
                  <div id="wwID0E3W3T">For more information, see Product Family Structure Tab Actions.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0ELX3T"><span>Open Structure in Creo View</span></div>
                </td>
                <td>
                  <div id="wwID0EZX3T">Displays the dynamic representation of a configurable part structure in the context of a variant specification.</div>
                  <div id="wwID0E4X3T">You can view the option filter and ad hoc selection rules for the variant specification that are applied when filtering the configurable part structure to obtain the visual representation.</div>
                  <div id="wwID0EBY3T">You can define visual mark-ups for the configurable part structure when you use the Creo View.</div>
                  <div id="wwID0EFY3T">For information about launching Creo view, see <span><a href="https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/WVSCreoViewIntegration/WVSCreoViewIntegrationLaunchingCView.html">Launching Creo View from Windchill</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0E6Y3T"><span>Request Deliverables</span></div>
                </td>
                <td>
                  <div id="wwID0ENZ3T">Creates variant solutions (deliverables) for organized and managed variant specifications. As a result, the variant parts no longer appear in the <span>Requested Deliverables</span> table. They appear in the <span>Completed Deliverables</span> table.</div>
                  <div>
                    <table>
                      <tr>
                        <td>
                          <div id="wwID0EH13T"><span><img src="../../../../../images/6652ad397dd1_note_16x16.png" alt="*" width="16" height="16" /></span> </div>
                        </td>
                        <td>
                          <div id="wwID0EI23T"><span><span>• </span></span>To generate a variant solution, the variant specification must not be shared to a project. It also must not have any generated deliverables attached, and must not be checked out.</div>
                          <div id="wwID0EK33T"><span><span>• </span></span>To perform this action, you must have Read and Modify permissions.</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
            </table>

<a id="wwID0EI43T"></a>

## Related Links
