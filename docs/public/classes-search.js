/* Optional reference-page search only; all class documentation works without JS. */
(() => {
  const controls=document.getElementById('classes-filters');
  if(!controls)return;
  const query=document.getElementById('classes-query');
  const category=document.getElementById('classes-category');
  const count=document.getElementById('classes-count');
  const empty=document.getElementById('classes-empty');
  const entries=[...document.querySelectorAll('.class-entry')].map(element=>({element,text:element.textContent.toLowerCase(),group:element.dataset.classGroup}));
  const groups=[...document.querySelectorAll('.classes-group')];
  const update=()=>{
    const terms=query.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    let found=0;
    for(const entry of entries){
      const match=(!category.value || category.value===entry.group) && terms.every(term=>entry.text.includes(term));
      entry.element.hidden=!match;if(match)found++;
    }
    for(const group of groups)group.hidden=![...group.querySelectorAll('.class-entry')].some(entry=>!entry.hidden);
    count.textContent=`${found} of ${entries.length} classes`;
    empty.hidden=found!==0;
  };
  controls.hidden=false;
  controls.addEventListener('input',update);
  document.getElementById('classes-clear').addEventListener('click',()=>{query.value='';category.value='';update();query.focus();});
})();
