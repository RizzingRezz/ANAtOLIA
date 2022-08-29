import React, { useEffect } from 'react';
import '../../App.css';

export default function Contact() {
  useEffect(() => {
    document.title = "ANAtOLIA | Contact"
  }, [])
  return (
    <>
      <div className='contact'>
        <h1 >Contact</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rhoncus, tortor at pulvinar venenatis, tellus est gravida nulla,
          vitae tempus elit nisl vestibulum arcu. Morbi pellentesque tincidunt metus auctor scelerisque. Nulla vehicula pharetra ullamcorper.
          Praesent ut lacus neque. Phasellus condimentum blandit lacus, id vulputate tellus venenatis eu. Mauris eleifend dolor vitae nisl varius,
          ac fermentum ante commodo. Cras sed felis ligula. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos
          himenaeos. Nulla facilisi. Etiam at malesuada sem. Pellentesque fermentum iaculis enim non auctor. Sed bibendum risus massa, eu eleifend
          dolor consectetur sed. Pellentesque aliquet eleifend eros. Integer semper dictum eleifend.</p>
        <p>Cras egestas efficitur sapien vitae pulvinar. Maecenas quis tortor felis. Suspendisse in aliquet turpis. Duis rutrum aliquam velit id
          euismod. Fusce eros est, ultricies at bibendum id, scelerisque a tellus. Praesent gravida eros nulla, quis mollis nisl placerat sed.
          Vestibulum sodales leo vel magna sollicitudin, ut aliquet quam lacinia. Duis laoreet fringilla pellentesque. Donec tincidunt sed ex
          vulputate luctus. Aenean ornare iaculis neque nec sodales. Phasellus aliquam, diam non lobortis accumsan, lectus quam porta nulla, in
          mattis mauris lectus non diam. Mauris blandit ante eu erat porta, et rutrum orci scelerisque.</p>
        <p id='last'>Duis eget enim eu ex consequat fermentum. Suspendisse sagittis consectetur sapien, at dignissim erat. Suspendisse est turpis,
          commodo id lectus non, ultricies pulvinar turpis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
          Suspendisse felis felis, vestibulum a imperdiet eget, finibus eu velit. Nullam eget sagittis metus. Aliquam nibh nisl, finibus vitae
          ipsum eget, mattis pulvinar sem. Etiam sit amet volutpat leo. Fusce fermentum felis est, eu pellentesque metus lobortis sit amet.
          Pellentesque sagittis euismod nulla hendrerit accumsan. Nulla orci enim, semper in mattis non, volutpat vitae tellus. Proin id mauris
          ac nibh egestas sagittis ullamcorper ut tortor. Curabitur pharetra, augue et elementum rutrum, metus enim laoreet mi, ut molestie urna
          quam convallis mi. Nullam vehicula dignissim tortor in vestibulum. Curabitur quis arcu sodales, imperdiet urna nec, pharetra lectus.</p>
      </div>
    </>
  );
}