class Popup
{
  constructor( url, features = {} )
  {
    this.url      = url;
    this.name     = features.name || '_blank';
    this.features = Popup.features;
    this.win      = null;
    this.timer    = null;

    delete features.name;

    this.blockedCallback = null;
    this.closedCallback = null;
    this.openedCallback = null;

    for (let f in features) {
      if ( ! (f in this.features) ) {
        continue;
      }

      if ( typeof features[ f ] === 'boolean' ) {
        this.features[ f ] = features[ f ] ? 1 : 0;
      } else {
        this.features[ f ] = features[ f ];
      }
    }

    this.features.width  = ( this.features.width  || screen.availWidth / 2 ) | 0;
    this.features.height = ( this.features.height || screen.availHeight / 2 ) | 0;
    this.features.left   = ( this.features.left   || ( screen.availWidth  - this.features.width ) / 2 ) | 0;
    this.features.top    = ( this.features.top    || ( screen.availHeight - this.features.height ) / 2 ) | 0;
  }

  featuresString()
  {
    const features = [];

    for ( let f in this.features ) {
      if ( this.features.hasOwnProperty( f ) ) {
        features[ features.length ] = `${f}=${this.features[ f ]}`;
      }
    }

    return features.join(',');
  }

  open()
  {
    this.win = window.open( this.url, this.name, this.featuresString() );

    if ( this.win && ! this.win.closed ) {

      this.win.focus();

      if ( typeof this.openedCallback === 'function' ) {
        this.openedCallback( this );
      }

      this.waitForClosed();

    } else if ( typeof this.blockedCallback === 'function' ) {

      this.blockedCallback( this );

    }

    return this;
  }

  close()
  {
    if ( this.win && ! this.win.closed ) {
      this.win.close();
    }

    return this;
  }

  clearTimer()
  {
    window.clearInterval( this.timer );
    this.timer = null;
  }

  waitForClosed()
  {
    if ( typeof this.closedCallback === 'function' ) {
      this.clearTimer();

      this.timer = window.setInterval( () => {
        if ( ! this.win || this.win.closed ) {
          this.clearTimer();
          this.closedCallback( this );
        }
      }, 500 );
    }
  }

  setCallback( name, callback )
  {
    const cb = `${name}Callback`;

    if ( typeof callback === 'function' && this.hasOwnProperty( cb ) ) {
      this[ cb ] = callback;
    }

    return this;
  }

  blocked( callback )
  {
    return this.setCallback( 'blocked', callback );
  }

  opened( callback )
  {
    return this.setCallback( 'opened', callback );
  }

  closed( callback )
  {
    return this.setCallback( 'closed', callback );
  }
}

Popup.features = {
  width: null,
  height: null,
  left: null,
  top: null,
  menubar: 0,
  toolbar: 0,
  location: 1,
  status: 1,
  resizable: 1,
  scrollbars: 1
};

export default Popup;
