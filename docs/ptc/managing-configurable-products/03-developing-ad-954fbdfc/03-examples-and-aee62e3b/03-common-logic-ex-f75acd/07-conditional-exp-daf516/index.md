# Conditional Expressions

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/WCOVCCondExpressions.html)  
> 获取日期：2026-11-12

<a id="wwID0E5XOT"></a>

<a id="wwID0EOYOT"></a>

In certain situations, you may require a parameter to have two different values based on a certain condition. For example, you have a small table fitted with casters to make it easily moveable. However, for some situations, the table may be fitted with two locking casters, so that the movement of the table can be more easily controlled.

<a id="wwID0ETYOT"></a>

While you could achieve this result using a case table, you could also use a conditional expression such as:

<a id="wwID0EYYOT"></a>

numberStandardCasters == (useLockingCaster ? 2 : 4)

<a id="wwID0EAZOT"></a>

This expression means: If useLockingCaster is true, then numberStandardCasters is 2, else it is 4

<a id="wwID0EFZOT"></a>

In this example, numberStandardCasters is an integer parameter that is used to define the number of standard (non-locking) casters on the table. This parameter should be defined using either a type of integer or real number, and then assigned to the usage link between the parent part (in this case, the small table) and the child part (in this case, the standard casters) using the Quantity Option field on the **Uses** tab for the parent part.

<a id="wwID0EQZOT"></a>

This example also uses the boolean parameter useLockingCaster, which has a value of True if locking casters are desired, and a value of False when they are not. Therefore, if the locking casters are desired, the value of useLockingCaster is True, and the value of numberStandardCasters is equal 2.

> ![\*](../../../../../images/6652ad397dd1_note_16x16.png) **Note:** Although a conditional expression of this type is very powerful, it cannot be used to perform conditional assignments. Expressions similar to the following are not supported: (useLockingCaster) ? legLength == 48 : legLength == 52
