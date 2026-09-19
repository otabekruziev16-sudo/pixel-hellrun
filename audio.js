const Sound={
  context:null,master:null,noiseBuffer:null,muted:false,supported:true,
  async unlock(){
    try{
      if(!this.context){
        const AC=window.AudioContext||window.webkitAudioContext;
        if(!AC){this.supported=false;this.updateButton();return;}
        this.context=new AC();this.master=this.context.createGain();
        this.master.gain.value=this.muted?0:0.42;this.master.connect(this.context.destination);
        this.noiseBuffer=this.context.createBuffer(1,this.context.sampleRate*.18,this.context.sampleRate);
        const data=this.noiseBuffer.getChannelData(0);
        for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(1-i/data.length);
      }
      if(this.context.state==='suspended')await this.context.resume();
    }catch{this.supported=false;this.updateButton();}
  },
  updateButton(){
    document.getElementById('soundBtn').textContent=this.supported?(this.muted?'∅':'♪'):'—';
    document.getElementById('soundBtn').setAttribute('aria-pressed',String(this.muted));
    document.getElementById('soundBtn').setAttribute('aria-label',this.muted?'Ovozni yoqish':'Ovozni o‘chirish');
  },
  toggle(){
    this.muted=!this.muted;
    try{localStorage.setItem('hellrun-muted',String(this.muted));}catch{}
    if(this.master)this.master.gain.setTargetAtTime(this.muted?0:.42,this.context.currentTime,.02);
    this.updateButton();this.unlock();
  },
  tone(freq,end,duration,volume=.16,type='triangle',delay=0){
    const ac=this.context;if(!ac||ac.state!=='running'||this.muted)return;
    const start=ac.currentTime+delay,o=ac.createOscillator(),g=ac.createGain();
    o.type=type;o.frequency.setValueAtTime(freq,start);
    o.frequency.exponentialRampToValueAtTime(Math.max(20,end),start+duration);
    g.gain.setValueAtTime(.0001,start);g.gain.exponentialRampToValueAtTime(volume,start+.008);
    g.gain.exponentialRampToValueAtTime(.0001,start+duration);
    o.connect(g);g.connect(this.master);o.start(start);o.stop(start+duration+.01);
    o.onended=()=>{o.disconnect();g.disconnect();};
  },
  noise(volume=.09,duration=.08){
    const ac=this.context;if(!ac||ac.state!=='running'||this.muted)return;
    const source=ac.createBufferSource(),filter=ac.createBiquadFilter(),gain=ac.createGain();
    source.buffer=this.noiseBuffer;filter.type='lowpass';filter.frequency.value=620;
    gain.gain.setValueAtTime(volume,ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+duration);
    source.connect(filter);filter.connect(gain);gain.connect(this.master);
    source.start();source.stop(ac.currentTime+duration);
    source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};
  },
  play(event){
    switch(event){
      case 'start':[196,261.63,329.63,392].forEach((f,i)=>this.tone(f,f,.16,.14,'square',i*.11));break;
      case 'step':this.noise(.09,.055);this.tone(100,65,.055,.09);break;
      case 'jump':this.tone(190,560,.16,.13,'square');break;
      case 'land':this.noise(.11,.075);break;
      case 'coin':this.tone(880,1320,.12,.13,'square');this.tone(1320,1760,.12,.1,'triangle',.08);break;
      case 'death':this.tone(330,45,.5,.22,'sawtooth');this.noise(.22,.16);break;
      case 'crumble':this.noise(.18,.12);break;
      case 'checkpoint':case 'complete':[392,494,587,784].forEach((f,i)=>this.tone(f,f,.18,.15,'square',i*.1));break;
      case 'door':this.tone(392,784,.3,.16);break;
      case 'win':[523,659,784,1047,784,1047].forEach((f,i)=>this.tone(f,f,.25,.15,'square',i*.15));break;
      case 'pause':this.tone(300,200,.08,.09);break;
    }
  }
};
