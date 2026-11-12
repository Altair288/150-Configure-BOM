# Authorizing Team Members to Create Independent Assigned Expressions

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsIndepExpressPermissions.html)  
> 获取日期：2026-11-12

<a id="wwID0ERMZR"></a>

<a id="wwID0ECNZR"></a>

This topic describes the permissions that are necessary for participants such as Team Members to create IndependentAssignedExpression objects.

<a id="wwID0EMNZR"></a>

The parent folder (Cabinet) for IndependentAssignedExpression objects resides in the System domain of the product, and the IndependentAssignedExpression object resides in the Default domain of the product. To create an object that resides in a folder, a participant must have Modify permission to the folder. Therefore, to create IndependentAssignedExpression objects, participants must be granted Modify permission on type Cabinet in the product System domain. To create a lifecycle-managed object such as IndependentAssignedExpression, participants are typically required to have Create permission for the object in its initial lifecycle state. Because of the current system limitation, participants are required to have Create permission in all states. To allow participants to create IndependentAssignedExpression objects, participants must be granted Create permission for type IndependentAssignedExpression for all states in the product Default domain.

<a id="wwID0ECOZR"></a>

An IndependentAssignedExpression is associated with business objects that implement the IndependentExpressionAssignable interface. When the associated object is saved to a different context, moved, or deleted, the same action is performed on the IndependentAssignedExpression. Because of these close relationships, it is recommended that you define policy rules for IndependentAssignedExpression similar to those defined for WTPart.

<a id="wwID0EZOZR"></a>

The following out-of-the-box access control policy rules grant Option Manager Full Control (All) permission for IndependentAssignedExpression and Cabinet objects.

<a id="wwID0EDPZR"></a>

For the organization context or Default/PDM domain:

<a id="wwID0EIPZR"></a>

Type: IndependentAssignedExpression

<a id="wwID0EFQZR"></a>

- Permissions: + Full Control (All)

<a id="wwID0EHRZR"></a>

- Participant: Option Manager

<a id="wwID0E1RZR"></a>

For the application context (for example, product) or System domain:

<a id="wwID0E6RZR"></a>

Type: Cabinet

<a id="wwID0E3SZR"></a>

- Permissions: +Full Control (All)

<a id="wwID0E5TZR"></a>

- Participant: Option Manager

<a id="wwID0ERUZR"></a>

In addition to these access control policy rules, the following rules are recommended for Team Members.

<a id="wwID0EWUZR"></a>

For the organization context, Default or PDM domain, or the application context (for example, product or Default domain):

<a id="wwID0E2UZR"></a>

Type: IndependentAssignedExpression

<a id="wwID0EYVZR"></a>

- State: All

<a id="wwID0E1WZR"></a>

- Permissions: +Read, +Create

<a id="wwID0E3XZR"></a>

- Participant: Team Members

<a id="wwID0EPYZR"></a>

Type: IndependentAssignedExpression

<a id="wwID0EMZZR"></a>

- State: In Work

<a id="wwID0EO1ZR"></a>

- Permissions: +Modify, +Delete, + Change Domain, + Create By Move, + Change Context

<a id="wwID0EQ2ZR"></a>

- Participant: Team Members

<a id="wwID0ED3ZR"></a>

Type: IndependentAssignedExpression

<a id="wwID0EA4ZR"></a>

- State: Released,

<a id="wwID0EC5ZR"></a>

- Permissions: +Revise,

<a id="wwID0EE6ZR"></a>

- Participant: Team Members

<a id="wwID0EX6ZR"></a>

For the application context (for example, product) or System domain:

<a id="wwID0EQA1R"></a>

- Type: Cabinet

<a id="wwID0EVB1R"></a>

- Permissions: +Modify

<a id="wwID0EXC1R"></a>

- Participant: Team Members

> ![\*](../../../../../images/6652ad397dd1_note_16x16.png) **Note:** • Currently, the only out-of-the-box rule that authorizes Team Members for the type IndependentAssignedExpression is in the organization, Default, or PDM domain, granting Read permission. • The ability to create and manage Independent Assigned Expressions is an advanced capability subject to a separate license entitlement.
