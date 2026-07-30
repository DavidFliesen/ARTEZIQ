document.addEventListener('keydown',e=>{
  if(e.key==='ArrowLeft'){const a=document.querySelector('.nav-arrow.left');if(a) location.href=a.href}
  if(e.key==='ArrowRight'){const a=document.querySelector('.nav-arrow.right');if(a) location.href=a.href}
});
