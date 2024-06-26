import React from 'react';

const TableauFrame = () => {
  return (
    <div className='tableauPlaceholder' id='viz1713284753347' style={{ position: 'relative' }}>
      <noscript>
        <a href='https://theurbanbout.wordpress.com/'>
          <img alt='GIZ India | Delhi | Housing & Planning Team | Team Leader: Ms. Aparna Das'
            src='https://public.tableau.com/static/images/GI/GIZHP_Work_Management/DB/1_rss.png'
            style={{ border: 'none' }} />
        </a>
      </noscript>
      <object className='tableauViz' style={{ display: 'none' }}>
        <param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' />
        <param name='embed_code_version' value='3' />
        <param name='site_root' value='' />
        <param name='name' value='GIZHP_Work_Management/DB' />
        <param name='tabs' value='no' />
        <param name='toolbar' value='yes' />
        <param name='static_image'
          value='https://public.tableau.com/static/images/GI/GIZHP_Work_Management/DB/1.png' />
        <param name='animate_transition' value='yes' />
        <param name='display_static_image' value='yes' />
        <param name='display_spinner' value='yes' />
        <param name='display_overlay' value='yes' />
        <param name='display_count' value='yes' />
        <param name='language' value='en-US' />
      </object>
      <script type='text/javascript'>
        var divElement = document.getElementById('viz1713284753347');
        var vizElement = divElement.getElementsByTagName('object')[0];
        vizElement.style.width='100%';
        vizElement.style.height='100%';
        var scriptElement = document.createElement('script');
        scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
        vizElement.parentNode.insertBefore(scriptElement, vizElement);
      </script>
    </div>
  );
};

export default TableauFrame;
