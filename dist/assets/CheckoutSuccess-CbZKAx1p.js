import{b as r,j as e,L as s}from"./index-BjQQlsnU.js";import{B as c}from"./button-ACLzmt5B.js";import{c as n}from"./createLucideIcon-ue6KKZuf.js";import"./utils-DP8r7NB_.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],i=n("circle-check",o);function d(){const[a]=r(),t=a.get("order")??"";return e.jsxs("div",{className:"max-w-5xl mx-auto px-4 py-16 text-center",children:[e.jsx(i,{className:"w-20 h-20 mx-auto mb-4 text-green-600"}),e.jsx("h1",{className:"text-3xl font-bold mb-3",children:"Đặt hàng thành công!"}),e.jsxs("p",{className:"text-gray-600 mb-6",children:["Mã đơn hàng của bạn là"," ",e.jsx("span",{className:"font-semibold",children:t||"Đang tạo"}),"."]}),e.jsxs("div",{className:"flex justify-center gap-3",children:[e.jsx(s,{to:"/",children:e.jsx(c,{className:"bg-orange-600 hover:bg-orange-700",children:"Tiếp tục mua sắm"})}),e.jsx(s,{to:"/cart",children:e.jsx(c,{variant:"outline",children:"Quay lại giỏ hàng"})})]})]})}export{d as CheckoutSuccess};
