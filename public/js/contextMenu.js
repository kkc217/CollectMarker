// // Context Menu 생성
// function handleCreateContextMenu(event){
//     // 기본 Context Menu가 나오지 않게 차단
//     event.preventDefault();
    
//     const ctxMenu = document.getElementById('inner_left');
    
//     // 노출 설정
//     ctxMenu.style.display = 'block';
    
//     // 위치 설정
//     ctxMenu.style.top = event.pageY+'px';
//     ctxMenu.style.left = event.pageX+'px';
//   }
  
//   // Context Menu 제거
//   function handleClearContextMenu(event){
//     const ctxMenu = document.getElementById('dochi_context_menu');
    
//     // 노출 초기화
//     ctxMenu.style.display = 'none';   
//     ctxMenu.style.top = null;
//     ctxMenu.style.left = null;
//   }
  
//   // 이벤트 바인딩
//   document.addEventListener('contextmenu', handleCreateContextMenu, false);
//   document.addEventListener('click', handleClearContextMenu, false);