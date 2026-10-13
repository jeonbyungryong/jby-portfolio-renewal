const dialog=document.querySelector('.zoom-dialog');
let origin;
if(dialog && typeof dialog.showModal==='function') {
  const image=dialog.querySelector('.zoom-image');
  const failure=dialog.querySelector('.zoom-error');
  image.addEventListener('error',()=>{if(dialog.open)failure.hidden=false;});
  document.querySelectorAll('[data-zoom]').forEach(link=> {
    link.addEventListener('click',event=> {
      if(event.button!==0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)return;
      if(dialog.open)return;
      failure.hidden=true;
      dialog.querySelector('.zoom-original').href=link.href;
      image.src=link.href;image.alt=link.querySelector('img')?.alt??'근거 이미지';
      dialog.querySelector('#zoom-caption').textContent=image.alt;
      origin=link;dialog.showModal();event.preventDefault();
    });
  });
  dialog.querySelector('.zoom-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  dialog.addEventListener('close',()=>{image.removeAttribute('src');origin?.focus({preventScroll:true});});
}
document.querySelectorAll('.evidence-image img').forEach(image=> {
  const failed=()=>{const message=image.closest('.evidence-image')?.querySelector('.image-error');if(message)message.hidden=false;};
  image.addEventListener('error',failed);
  if(image.complete && !image.naturalWidth)failed();
});
if(!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const observer=new IntersectionObserver(entries=> {
    entries.forEach(entry=> {
      if(entry.isIntersecting) {entry.target.classList.remove('reveal-pending');observer.unobserve(entry.target);}
    });
  },{threshold:0.06});
  document.querySelectorAll('.project-copy,.section-heading').forEach(element=> {
    if(element.getBoundingClientRect().top>innerHeight){element.dataset.reveal='';element.classList.add('reveal-pending');observer.observe(element);}
  });
  document.documentElement.classList.add('js-ready');
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',event=> {
    if(event.matches) {observer.disconnect();document.querySelectorAll('.reveal-pending').forEach(element=>element.classList.remove('reveal-pending'));}
  });
}
