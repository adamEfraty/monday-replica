

export function getSvg(svgName){
    switch(svgName){
      case 'home-icon':
        return (
        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true" className="icon_35c1b9ef14 icon" data-testid="icon">
          <path d="M9.56992 2.1408C9.82591 1.95307 10.1741 1.95307 10.4301 2.1408L17.7028 7.47413C17.8896 7.61113 18 7.82894 18 8.06061V16.7879C18 17.1895 17.6744 17.5152 17.2727 17.5152H11.9394C11.5377 17.5152 11.2121 17.1895 11.2121 16.7879V13.1515H8.78788V16.7879C8.78788 17.1895 8.46227 17.5152 8.06061 17.5152H2.72727C2.32561 17.5152 2 17.1895 2 16.7879V8.06061C2 7.82894 2.11037 7.61113 2.29719 7.47413L9.56992 2.1408ZM3.45455 8.42914V16.0606H7.33333V12.4242C7.33333 12.0226 7.65894 11.697 8.06061 11.697H11.9394C12.3411 11.697 12.6667 12.0226 12.6667 12.4242V16.0606H16.5455V8.42914L10 3.62914L3.45455 8.42914Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
          </svg>)

      case 'white-arrow':
        return(<svg width="24" height="12" viewBox="0 0 24 12" xmlns="http://www.w3.org/2000/svg">
          <polygon points="0,12 24,12 12,0" fill="white" />
        </svg>)

      case 'status-icon':
        return (<svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><rect width="20" height="20" rx="3.636" fill="#00C875"></rect><g filter="url(#filter0_d_43912_44076)" fill="#fff"><rect x="5.227" y="5.453" width="9.318" height="2.727" rx=".455"></rect><rect x="5.227" y="8.635" width="9.318" height="2.727" rx=".455"></rect><rect x="5.227" y="11.816" width="9.318" height="2.727" rx=".455"></rect></g><defs><filter id="filter0_d_43912_44076" x="3.408" y="4.544" width="12.955" height="12.727" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood result="BackgroundImageFix" flood-opacity="0"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy=".909"></feOffset><feGaussianBlur stdDeviation=".909"></feGaussianBlur><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.200691 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_43912_44076"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow_43912_44076" result="shape"></feBlend></filter></defs></svg>)
      
      // there is imposter amoung us...
      case 'priority-icon':
        return (<img class="monday-column-icon-component__icon" style={{width:'20px', height: '20px'}} src="https://files.monday.com/euc1/photos/10162286/original/app_version_10162286_photo_2023_10_26_13_37_04.png?1738076366987" alt=""></img>)
    
      case 'members-icon':
        return (<svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><rect width="20" height="20" rx="3.636" fill="#66CCFF"></rect><g filter="url(#filter0_d_43912_44048)"><path d="M12.8621 6.97735C12.8621 8.53537 11.6127 9.79841 10.0716 9.79841C8.53054 9.79841 7.28122 8.53537 7.28122 6.97735C7.28122 5.41929 8.53054 4.15625 10.0716 4.15625C11.6127 4.15625 12.8621 5.41929 12.8621 6.97735ZM5.16364 14.7105C5.34269 12.6195 6.79164 10.8633 10.0839 10.8633C13.3761 10.8633 14.825 12.6195 15.0041 14.7105C15.0255 14.9607 14.8197 15.1647 14.5687 15.1647H5.59905C5.34801 15.1647 5.14223 14.9607 5.16364 14.7105Z" fill="#fff" fill-rule="evenodd" clip-rule="evenodd"></path></g><defs><filter id="filter0_d_43912_44048" x="3.344" y="3.247" width="13.48" height="14.645" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood result="BackgroundImageFix" flood-opacity="0"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy=".909"></feOffset><feGaussianBlur stdDeviation=".909"></feGaussianBlur><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_43912_44048"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow_43912_44048" result="shape"></feBlend></filter></defs></svg>)
  
      case 'date-icon':
        return (<svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><rect width="20" height="20" rx="3.636" fill="#9D50DD"></rect><g filter="url(#filter0_d_43912_44067)" fill="#fff" clip-path="url(#clip0_43912_44067)"><path d="M14.9666 8.1408C15.0359 8.1408 15.1024 8.11327 15.1514 8.06425 15.2004 8.01524 15.228 7.94876 15.228 7.87944V7.74876C15.228 7.33285 15.0628 6.93398 14.7687 6.63989 14.4746 6.34579 14.0757 6.18058 13.6598 6.18058H13.0064V5.42489C13.0064 5.2516 12.9376 5.0854 12.815 4.96286 12.6925 4.84033 12.5263 4.77148 12.353 4.77148 12.1797 4.77148 12.0135 4.84033 11.891 4.96286 11.7684 5.0854 11.6996 5.2516 11.6996 5.42489V6.18058H8.30185V5.42489C8.30185 5.2516 8.23301 5.0854 8.11047 4.96286 7.98793 4.84033 7.82173 4.77148 7.64844 4.77148 7.47514 4.77148 7.30895 4.84033 7.18641 4.96286 7.06387 5.0854 6.99503 5.2516 6.99503 5.42489V6.18058H6.34162C5.92571 6.18058 5.52684 6.34579 5.23275 6.63989 4.93866 6.93398 4.77344 7.33285 4.77344 7.74876V7.87944C4.77344 7.94876 4.80097 8.01524 4.84999 8.06425 4.899 8.11327 4.96548 8.1408 5.0348 8.1408H14.9666zM5.0348 8.86328C4.96548 8.86328 4.899 8.89766 4.84999 8.95886 4.80097 9.02006 4.77344 9.10307 4.77344 9.18962V13.2689C4.77344 13.7882 4.93866 14.2862 5.23275 14.6534 5.52684 15.0206 5.92571 15.2269 6.34162 15.2269H13.6598C14.0757 15.2269 14.4746 15.0206 14.7687 14.6534 15.0628 14.2862 15.228 13.7882 15.228 13.2689V9.18962C15.228 9.10307 15.2004 9.02006 15.1514 8.95886 15.1024 8.89766 15.0359 8.86328 14.9666 8.86328H5.0348z"></path></g><defs><clipPath id="clip0_43912_44067"><path fill="#fff" transform="translate(4.773 4.773)" d="M0 0H10.454V10.454H0z"></path></clipPath><filter id="filter0_d_43912_44067" x="2.955" y="3.864" width="14.091" height="14.091" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood result="BackgroundImageFix" flood-opacity="0"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy=".909"></feOffset><feGaussianBlur stdDeviation=".909"></feGaussianBlur><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_43912_44067"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow_43912_44067" result="shape"></feBlend></filter></defs></svg>)
      
      
      default:
        console.log('Svg Not Found')
        return <div/>
    }
  }

