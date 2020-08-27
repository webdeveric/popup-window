const has = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

export default class Popup
{
  static features = {
    width: null,
    height: null,
    left: null,
    top: null,
    menubar: 0,
    toolbar: 0,
    location: 1,
    status: 1,
    resizable: 1,
    scrollbars: 1,
  };

  constructor( url = '', features = {} )
  {
    this.url   = url;
    this.name  = '_blank';
    this.win   = null;
    this.timer = null;

    this.blockedCallback = null;
    this.closedCallback  = null;
    this.openedCallback  = null;

    this.setFeatures( features );
  }

  setFeatures( features )
  {
    this.features = Popup.features;

    if ( features.name ) {
      this.name = features.name;
      delete features.name;
    }

    for ( const f in features ) {
      if ( ! ( f in this.features ) ) {
        continue;
      }

      if ( typeof features[ f ] === 'boolean' ) {
        this.features[ f ] = features[ f ] ? 1 : 0;
      } else {
        this.features[ f ] = features[ f ];
      }
    }

    if ( this.features.width === null ) {
      this.features.width = window.screen.availWidth / 2;
    }

    if ( this.features.height === null ) {
      this.features.height = window.screen.availHeight / 2;
    }

    if ( this.features.left === null ) {
      this.features.left = ( window.screen.availWidth - this.features.width ) / 2;
    }

    if ( this.features.top === null ) {
      this.features.top = ( window.screen.availHeight - this.features.height ) / 2;
    }

    this.features.width  = this.features.width | 0;
    this.features.height = this.features.height | 0;
    this.features.left   = ( this.features.left + window.screen.availLeft ) | 0;
    this.features.top    = ( this.features.top + window.screen.availTop ) | 0;

    return this;
  }

  featuresString()
  {
    const features = [];

    for ( const f in this.features ) {
      if ( has(this.features, f) && this.features[ f ] !== null ) {
        features[ features.length ] = `${f}=${this.features[ f ]}`;
      }
    }

    return features.join(',');
  }

  open()
  {
    this.win = window.open( this.url, this.name, this.featuresString() );

    if ( this.win && ! this.win.closed ) {
      this.win.moveTo( this.features.left, this.features.top );
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

    if ( typeof callback === 'function' && has(this, cb) ) {
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
