import{r as c,j as e,c as i}from"./index-Bo-zjkLC.js";const d=({day:a,budget:s,maxBudget:t,animated:n=!0})=>{const l=s/t*100,r=l>60?"bg-e10-green":l>30?"bg-amber-500":"bg-p5-red";return c.useEffect(()=>{},[s,n]),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsxs("div",{className:"flex justify-between items-center text-sm font-semibold text-slate-300",children:[e.jsxs("span",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-lg",children:"📅"}),"Día ",a]}),e.jsxs("span",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-lg",children:"⚡"}),"Acciones: ",s,"/",t]})]}),e.jsx("div",{className:"w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700 shadow-inner",children:e.jsx("div",{className:i("h-full transition-all duration-500 ease-out",r,n&&"animate-fill"),style:{width:`${l}%`}})}),e.jsxs("p",{className:"text-xs text-slate-500 text-center",children:[s===t&&"¡Acciones completadas!",s<t&&s>0&&`Quedan ${t-s} acciones`]})]})};if(typeof document<"u"){const a=document.createElement("style");a.textContent=`
    @keyframes fill {
      from { width: 0%; }
      to { width: var(--target-width); }
    }
    .animate-fill {
      animation: fill 0.5s ease-out forwards;
    }
  `,document.head.appendChild(a)}export{d as D};
//# sourceMappingURL=DayBudgetBar-DqD_1OYE.js.map
