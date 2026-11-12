# Expression Editor

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsExpressionEditor.html)  
> 获取日期：2026-11-12

<a id="wwID0ELPET"></a>

<a id="wwID0E2PET"></a>

The Expression Editor allows you to create a logical expression constraint for a configurable module. An expression evaluates whether one or more conditions are met.

<a id="wwID0EAQET"></a>

A logical expression can consist of one or multiple parts. You can type your expression directly into the **Expression** box, or you can use the editor's options to form the expression. The expression is validated when you click **Apply**.

<a id="wwID0EOQET"></a>

The Expression Editor provides the following options:

<table border="1">
              <tr>
                <th>
                  <div id="wwID0EURET">Name</div>
                </th>
                <th>
                  <div id="wwID0E5RET">Description</div>
                </th>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EQSET"><span>Logical</span></div>
                </td>
                <td>
                  <div id="wwID0E4SET">Allows up to two logical conditions being selected. The available operators are as follows:</div>
                  <div>
                    <table>
                      <tr>
                        <td>
                          <div id="wwID0EOTET"><span><img src="../../../../../images/6652ad397dd1_note_16x16.png" alt="*" width="16" height="16" /></span> </div>
                        </td>
                        <td>
                          <div id="wwID0ESTET">You can select either <span>&amp;&amp;</span> or <span>||</span>, they cannot be used together. ! is always enabled.</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div id="wwID0EUUET"><span><span>• </span></span><span>&amp;&amp;</span> -- Specifies an AND condition. Both conditions must be met when this operator is used. For example, A&gt;=0 &amp;&amp; B&gt;=0. In this example both A and B must be greater or equal to zero for the expression to be valid.</div>
                  <div id="wwID0EZVET"><span><span>• </span></span><span>||</span> -- Specifies an OR condition. Only part of the condition needs to be met when this operator is used. For example, A&gt;=0 || B&gt;=0. In this example either A or B must be greater than equal to zero for the expression to be valid.</div>
                  <div id="wwID0E5WET"><span><span>• </span></span><span>!</span> -- Specifies a false condition. Indicates the specified parameter or method does not yield the specified value.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0E4XET"><span>Parameter</span></div>
                </td>
                <td>
                  <div id="wwID0EKYET">Tree displays the parameters which are selectable for the configurable module. Only those configurable modules for which a Reference ID is defined are displayed.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EYYET"><span>Method</span></div>
                </td>
                <td>
                  <div id="wwID0EFZET">If the check box is selected, a corresponding method can be selected. Only methods available for the selected parameter are displayed. If no methods are available, the box is empty.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0ETZET"><span>Operator</span></div>
                </td>
                <td>
                  <div id="wwID0EA1ET">If the check box is selected, an operator can be selected. The possible operators are:</div>
                  <div id="wwID0EY1ET"><span><span>• </span></span>&lt; — Value of parameter is less than what is specified.</div>
                  <div id="wwID0E12ET"><span><span>• </span></span>&lt;= — Value of parameter is less than or equal to what is specified.</div>
                  <div id="wwID0E33ET"><span><span>• </span></span>== — Value of parameter is equal to the value specified.</div>
                  <div id="wwID0E54ET"><span><span>• </span></span>!= — Value of parameter is not equal to the parameter specified.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0E15ET"><span>Parameter/Value</span></div>
                </td>
                <td>
                  <div id="wwID0EH6ET">Designates a specific value or specifies a parameter to use in the expression. Only those configurable modules for which a Reference ID is defined are displayed.</div>
                </td>
              </tr>
            </table>

<a id="wwID0EEAFT"></a>

1. Click **Add** to add your selections to the existing expression text.

|  |  |
| --- | --- |
| **![\*](../../../../../images/6652ad397dd1_note_16x16.png)** | The expression is not validated until you click **Apply**. |

<a id="wwID0EJCFT"></a>

2. Click **Insert ()** to place parenthesis around the expression displayed in the **Expression** field.

<a id="wwID0ETDFT"></a>

3. When you have finished creating your expression, click **Apply** to apply the expression. The expression is validated, and you are informed of any syntax errors.

<a id="wwID0EKEFT"></a>

For more information on the use of logic within an expression, see [Using Numeric Operators and Functions in Advanced Logic](../../07-using-numeric-34971aaf/index.md#wwID0E6GGT "Using Numeric Operators and Functions in Advanced Logic").
