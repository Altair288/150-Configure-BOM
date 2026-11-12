# Case Table Editor

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsCaseTableEditor.html)  
> 获取日期：2026-11-12

<a id="wwID0EZYCT"></a>

<a id="wwID0EJZCT"></a>

Case tables provide an easy way to specify constraints for a configurable module. A case table specifies permissible sets of values for a set of configurable module parameters used in the Configuration action. Case tables allow placing limits on parameters when those limits cannot be expressed as value expressions, or when they are restrictive, or the constraints are loose. A configurable module can have any number of case tables.

<a id="wwID0EOZCT"></a>

To display the **Case Table Editor**, select **Case Table** from the **Constraint Type** drop-down list on the **Constraints** tab. The **Case Table Editor** is displayed immediately below the **Constraints** pane. The **Case Table Editor** provides the following options:

<table border="1">
              <tr>
                <th>
                  <div id="wwID0ES2CT">Icon</div>
                </th>
                <th>
                  <div id="wwID0E32CT">Description</div>
                </th>
              </tr>
              <tr>
                <td><div><div id="wwID0EL3CT"><img src="../../../../../images/5808d4f6f32d_Icon_SelectParameters.png" alt="" /> <span>Select Parameter</span></div></div></td>
                <td>
                  <div id="wwID0EC4CT">Defines the parameters included in the case table. For more information, see <span><a href="03-selecting-cas-7943f856/index.md#wwID0EEEET">Selecting Case Table Parameters</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0E24CT"><img src="../../../../../images/88292080024c_Exp_IconPageBreak.gif" alt="" /> <span>Generate Cases for Enumerated Parameters</span></div></div></td>
                <td>
                  <div id="wwID0ES5CT">Generates cases if the case table has one or more enumerative parameters (parameters that have a list of allowed values).</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0E25CT"><img src="../../../../../images/22aa5ed232d8_IconDelete.gif" alt="" /> <span>Remove</span></div></div></td>
                <td>
                  <div id="wwID0ER6CT">Removes a selected row from the editor.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0E16CT"><img src="../../../../../images/bf930923297f_IconCopy.gif" alt="" /> <span>Copy casetable to desktop</span></div></div></td>
                <td>
                  <div id="wwID0EQADT">Copies the selected row or rows to the clipboard. These rows can then be pasted into an Excel spreadsheet.</div>
                  <div>
                    <table>
                      <tr>
                        <td>
                          <div id="wwID0EBBDT"><span><img src="../../../../../images/887c9a51d571_tip_16x16.png" alt="*" width="16" height="16" /></span> </div>
                        </td>
                        <td>
                          <div id="wwID0EGBDT">The structure of the case table can be recreated in a new configurable module and populated using the copy and paste actions from your desktop.</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div>
                    <table>
                      <tr>
                        <td>
                          <div id="wwID0EYBDT"><span><img src="../../../../../images/6652ad397dd1_note_16x16.png" alt="*" width="16" height="16" /></span> </div>
                        </td>
                        <td>
                          <div id="wwID0EBCDT">This icon is not available for case tables containing conditional logic, keywords, or formulae.</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0EKCDT"><img src="../../../../../images/d446a8f67eec_IconPaste.gif" alt="" /> <span>Paste casetable from desktop</span></div></div></td>
                <td>
                  <div id="wwID0EADDT">Pastes the selected data into the table. Data can be pasted from an Excel spreadsheet.</div>
                  <div>
                    <table>
                      <tr>
                        <td>
                          <div id="wwID0ERDDT"><span><img src="../../../../../images/6652ad397dd1_note_16x16.png" alt="*" width="16" height="16" /></span> </div>
                        </td>
                        <td>
                          <div id="wwID0E1DDT">This icon is not available for case tables containing formulae or when the selected data contains conditional logic or keywords.</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
            </table>

<a id="wwID0EHEDT"></a>

## Editing Parameters in a Case Table

<a id="wwID0ENEDT"></a>

A case table specifies permissible sets of values for a selected set of parameters. The actions to set the values depend on the parameter type, parameter constraints, and whether the **Enable Advanced Case Tables** preference is enabled. Clicking the ![](../../../../../images/cb9ad3573756_Icon_EditCaseTableParam.png) **Edit Case Table Parameter** icon in **Case Table Editor** opens the **Edit Case Table Parameter** window, where you can add parameters for which you want to add columns. Each parameter is listed in a separate column in the table.

<a id="wwID0EKFDT"></a>

When the **Enable Advanced Case Tables** preference is enabled, the case table allows values to be set using the **Edit Case Table Parameter** icon, or the ![](../../../../../images/a8f307b0313e_Icon_EditParamFormula.png) **Edit Parameter Formula** icon for parameter types that allow the use of conditional logic, keywords, or formulae.

<a id="wwID0EDGDT"></a>

When the **Enable Advanced Case Tables** preference is disabled, the case table allows values to be specified inline or using the ![](../../../../../images/3115fb6eed7e_OptionsSpecifyRange.png) **Specify Range** icon.

<a id="wwID0EZGDT"></a>

For more information, see:

<a id="wwID0ESHDT"></a>

- [Editing a Case Table Parameter](01-editing-a-cas-3b3804f7/index.md#wwID0ELNDT "Editing a Case Table Parameter")

<a id="wwID0E6IDT"></a>

- [Editing a Parameter Formula](02-editing-a-param-4b0554/index.md#wwID0EA1DT "Editing a Parameter Formula")

<a id="wwID0EMKDT"></a>

- [Specifying a Parameter Range](../../01-adding-a-parameter/01-editing-a-parameter/02-constraint-ta-37f5a979/01-specifying-a-pa-eb4b86/index.md#wwID0EZH6S "Specifying a Parameter Range")

<a id="wwID0E1LDT"></a>

- [Using Numeric Operators and Functions in Advanced Logic](../../07-using-numeric-34971aaf/index.md#wwID0E6GGT "Using Numeric Operators and Functions in Advanced Logic")
