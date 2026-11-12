# Baseline Objects Table

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodfamily/ProdFamilyVariantBaselineObjectsTab.html)  
> 获取日期：2026-11-12

<a id="wwID0EXCEU"></a>

<a id="wwID0EHDEU"></a>

The **Baseline Objects** table displayed on the **Baseline Objects** tab of the variant baseline information page lists the parts and module variants that are associated with the variant baseline. The following columns are of particular interest when managing baseline objects.

| Table column | Description |
| --- | --- |
| **Baseline object association lock status** | Displays the lock icon ![](../../../../../images/016d257919c2_GlyphLocked.gif) for baseline objects that match the criteria based on business rules. The column header displays the tooltip as **Baseline object association lock status**.Out of the box, whenever a baseline object’s status is changed to In Assembly, the object becomes locked and cannot be removed from the variant baseline to preserve the integrity of the information about the physical prototype that is being built. |
| **General Status** | Displays the general status for the baseline member, such as whether the baseline member is checked out. |
| **Revision** | Displays the revision of a part that is included in the variant baseline. |
| **Status** | Displays the revision’s status relative to the prototype process. This status is manually updated using the **Edit Baseline Objects** window. |

<a id="wwID0EQJEU"></a>

To manage the parts listed in the **Baseline Objects** table, the following actions are available in the table tool bar.

<table border="1">
              <tr>
                <th>
                  <div id="wwID0EYKEU">Action</div>
                </th>
                <th>
                  <div id="wwID0EELEU">Description</div>
                </th>
              </tr>
              <tr>
                <td><div><div id="wwID0EXLEU"><span>Open in Product Family Matrix Editor</span> <img src="../../../../../images/e179db1d4271_IconMatrixEditor.gif" alt="" /></div></div></td>
                <td>
                  <div id="wwID0EPMEU">Opens the selected variant baseline and its variant specifications in Matrix Editor with path filter applied based on the selected parts.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0E4MEU"><span>Add Baseline Objects</span> <img src="../../../../../images/5669a06a74e1_IconLotBaselineAdd.png" alt="" /></div></div></td>
                <td>
                  <div id="wwID0ETNEU">Allows you to add parts to the variant baseline that are required to develop a prototype. For more information, see <span><a href="01-adding-baseline-1ccb9f/index.md#wwID0E11EU">Adding Baseline Objects</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EOOEU"><span>Remove Baseline Objects</span></div>
                </td>
                <td>
                  <div id="wwID0E3OEU">Allows you to remove a part from the variant baseline.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0ELPEU"><span>Update Baseline Objects</span></div>
                </td>
                <td>
                  <div id="wwID0EZPEU">Allows you to update variant baseline members by selecting a variant specification revision.</div>
                  <div id="wwID0E4PEU">For more information, see <span><a href="02-update-baseli-d1a1962a/index.md#wwID0E4OFU">Update Baseline Objects Window</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0E1QEU"><span>Edit Baseline Objects</span> <img src="../../../../../images/76994d3648f4_IconLotBaselineEdit.png" alt="" /></div></div></td>
                <td>
                  <div id="wwID0ERREU">Allows you to update the status of the part as it progresses through the prototype development stages, and other soft attributes on the baseline member link. For more information, see <span><a href="03-edit-baseline-o-9db595/index.md#wwID0ERZFU">Editing Baseline Objects</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0ELSEU"><span>Copy Selected Object</span></div>
                </td>
                <td>
                  <div id="wwID0EZSEU">Allows you to copy the selected baseline object (module variants) along with the baseline member link to the clipboard.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EITEU"><span>Paste copied objects to this variant baseline</span></div>
                </td>
                <td>
                  <div id="wwID0EWTEU">Allows you to paste the module variants or parts that you copied from another variant baseline or from a different location such as a <span>Folders</span> page. This creates a baseline member link between the variant baseline and the pasted module variant or part. The attributes on the new baseline member link are populated from the baseline member link if the module variants or parts are copied from another variant baseline.</div>
                  <div id="wwID0E6TEU">The baseline member link between the pasted module variant or part and the variant baseline is populated with new values prescribed by the <span>Reset Variant Baseline Member Link Attribute Values During A Paste Operation</span> preference. This allows you to provide a comma-separated list of variant baseline member link attribute names, whose values must be reset to their default values during the paste operation. Value of an attribute is populated from the copied variant baseline member link, if the relevant attribute is not included in this preference.</div>
                  <div>
                    <table>
                      <tr>
                        <td>
                          <div id="wwID0EVUEU"><span><img src="../../../../../images/6652ad397dd1_note_16x16.png" alt="*" width="16" height="16" /></span> </div>
                        </td>
                        <td>
                          <div id="wwID0EWVEU"><span><span>• </span></span>When you paste an invalid object type other than part, the system displays the corresponding error message.</div>
                          <div id="wwID0EYWEU"><span><span>• </span></span>You can reset the <span>Status</span> attribute and other custom attributes on the baseline member link to its default value while pasting.</div>
                          <div id="wwID0E5XEU"><span><span>• </span></span>If you paste the same revision of the module variant that is already associated with the variant baseline, the system displays the corresponding message.</div>
                          <div id="wwID0EAZEU"><span><span>• </span></span>If you have enabled the <span>Remove On Paste</span> preference under <span>Display</span> &gt; <span>Clipboard</span>, the copied objects are removed from the clipboard after pasting.</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
            </table>
