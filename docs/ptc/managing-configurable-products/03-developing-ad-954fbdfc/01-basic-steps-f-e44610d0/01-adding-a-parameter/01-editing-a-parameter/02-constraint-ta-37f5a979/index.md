# Constraint Tab of the Edit Parameter Window

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsEditParamConstrTab.html)  
> 获取日期：2026-11-12

<a id="wwID0EOR5S"></a>

<a id="wwID0E6R5S"></a>

The **Constraint** tab of the **Edit Parameter** window allows you to specify a parameter constraint that restricts the values that can be specified for the parameter. For example, if the Range constraint is defined as greater than 0 and less than 5 for the type Integer, the only possible values for this parameter can be 1, 2, 3, or 4.

<a id="wwID0ENS5S"></a>

The following constraint types are supported:

<table border="1">
              <tr>
                <th>
                  <div id="wwID0EWT5S">Field</div>
                </th>
                <th>
                  <div id="wwID0EDU5S">Description</div>
                </th>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EYU5S"><span>None</span></div>
                </td>
                <td>
                  <div id="wwID0EIV5S">Indicates that there are no constraints for this parameter.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EZV5S"><span>Range</span></div>
                </td>
                <td>
                  <div id="wwID0EJW5S">Specifies a range of valid values for the parameter. If this option is selected, you are asked to specify a minimum and maximum value. A range can be used for any primitive type (excluding Boolean).</div>
                  <div>
                    <table>
                      <tr>
                        <td>
                          <div id="wwID0E1W5S"><span><img src="../../../../../../images/6652ad397dd1_note_16x16.png" alt="*" width="16" height="16" /></span> </div>
                        </td>
                        <td>
                          <div id="wwID0EDX5S">This constraint type is not available for the following parameter types:</div>
                          <div id="wwID0E3X5S"><span><span>• </span></span>URL</div>
                          <div id="wwID0E5Y5S"><span><span>• </span></span>Real with Units</div>
                          <div id="wwID0EA15S"><span><span>• </span></span>Reference</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0E615S"><span>List</span></div>
                </td>
                <td>
                  <div id="wwID0EP25S">Indicates that there is a list of possible values for the parameter. This option is available for all primitive types except Boolean.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EA35S"><span>Dynamic List</span></div>
                </td>
                <td>
                  <div id="wwID0EQ35S">Allows you to specify a Java class and a static method that returns the list of allowed values based on the values of other parameters of the part. For this option, you are asked to enter a class name and method name that is used to return a <span>java.util.SortedMap</span> between the allowed values and its image URLs. This option is available for all primitive types except Boolean, URL, Reference, Real Number with Units.</div>
                </td>
              </tr>
            </table>

<a id="wwID0EC45S"></a>

## Using Dynamic Lists

<a id="wwID0EG45S"></a>

To specify a constraint using a dynamic list:

<a id="wwID0E545S"></a>

1. Select **Dynamic List** on the **Constraint** tab.

<a id="wwID0EI65S"></a>

2. Specify the class name, for example, com.ext.CustomDynamicList. This custom class must be included in the codebase. Once it is added, you can browse the codebase to select the class.

<a id="wwID0EOA6S"></a>

3. Specify the method name that is introduced in the custom class, for example, getAllowedValues.

<a id="wwID0EUB6S"></a>

4. The constraint is added to the constraint list.

<a id="wwID0EGC6S"></a>

Consider this information on configuring dynamic lists:

<a id="wwID0E5C6S"></a>

- The static method must take one argument, Vector, and return SortedMap. For example, the method signature may be as follows: public static SortedMap getAllowedValues(Vector parameters).

<a id="wwID0EME6S"></a>

- The SortedMap consists of Key/Value pairs, where the Key is the allowed value (for example, Red), and the Value is the name of an image (for example, red.gif) to be displayed with the allowed value. The image must be available in the WT\_HOME/codebase/wt/clients/images directory.

<a id="wwID0EVF6S"></a>

- The Value is optional and must be an empty String (“ ”) if no image is available.

<a id="wwID0EPG6S"></a>

- You can optionally specify some parameters to be passed to the method to generate the allowed values. In the code, the parameters are passed as ExternalAppData objects.
