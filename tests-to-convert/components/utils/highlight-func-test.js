/**
 * @jest-environment jsdom
 */
import '../../../src/utils/highlight';

const ipsum = `<section id="main" class="page-container" role="main">
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras convallis orci quis leo suscipit lobortis. Aenean congue bibendum mauris, nec volutpat leo consectetur in. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed lobortis sed odio nec auctor. Integer efficitur augue nisl, vitae gravida tortor tristique fermentum. Donec vestibulum orci vel enim gravida dictum. Pellentesque et orci in massa fermentum tempus. Proin risus tortor, facilisis facilisis risus vel, euismod congue ipsum. Fusce semper odio at neque aliquet, id ornare nisl consectetur. In finibus ipsum orci, vel tempor turpis venenatis in.
  </p>
  <p>In in mauris a nulla imperdiet convallis id ut felis. Donec arcu nulla, varius congue elit nec, lacinia porta elit. Mauris blandit lorem a ex ultrices viverra. Sed facilisis varius risus, quis ornare erat rutrum id. Curabitur neque velit, gravida in consectetur eget, lobortis eu leo. Quisque in ornare lacus, auctor rhoncus nisl. Sed tellus metus, luctus rhoncus efficitur sit amet, malesuada vestibulum eros. Ut laoreet rhoncus ornare. Etiam volutpat tincidunt tincidunt. Curabitur sed massa tortor. Aenean eu nisl consectetur, molestie elit vitae, luctus erat. Fusce sed mattis erat, in bibendum lacus. Proin mi lectus, tincidunt tempus lacus sed, aliquam hendrerit urna. Integer ullamcorper leo at egestas sagittis. Fusce ut dapibus felis.</p>
  <p>Aliquam condimentum sapien metus, quis commodo urna blandit sit amet. In elit eros, elementum ut erat eget, malesuada feugiat nisi. Donec dapibus neque nec gravida fermentum. Vestibulum in sapien et metus vehicula porta. Donec vel turpis dui. Morbi ultricies ut sapien ut placerat. Donec sagittis egestas sagittis. Aliquam enim dui, congue vel sollicitudin sit amet, luctus efficitur turpis. Nam nec neque ante. Praesent tempor turpis et auctor interdum. Fusce lobortis libero sit amet ultrices cursus. Cras pellentesque ultrices leo in vehicula. Aenean vehicula, elit quis rhoncus blandit, neque ligula cursus purus, vitae lacinia libero sem at lectus. Suspendisse ac metus mi.</p>
  <p>Sed at venenatis est. Mauris molestie blandit quam et porta. Nam accumsan lacus neque. Donec vitae condimentum justo. Maecenas sagittis imperdiet nunc vitae aliquam. Nulla consequat tincidunt ante, ut vestibulum augue mattis vitae. Nulla facilisi. Donec scelerisque nunc non nisl accumsan, in rutrum quam condimentum. Nullam non rhoncus erat. Suspendisse interdum gravida mollis. Nulla laoreet enim justo, vel tincidunt velit condimentum sed. Aenean odio ipsum, ornare nec velit at, fringilla consectetur dui. Sed malesuada mi ac dignissim porta. In et arcu non dui vehicula porta. In eget rhoncus ante. Fusce sodales mauris vitae lorem luctus pellentesque.</p>
  <p>Etiam lacus mauris, blandit molestie sem a, semper vulputate eros. Duis et rutrum nibh. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec finibus turpis vitae justo cursus, facilisis ullamcorper tortor commodo. Maecenas porta elit a cursus convallis. Fusce arcu est, viverra sed elit eget, aliquam pretium lacus. Mauris interdum ligula vitae nisi dictum elementum. Proin ac velit aliquam, pretium lectus non, commodo sem. Cras iaculis imperdiet neque, ac volutpat enim sollicitudin sit amet. Maecenas nec efficitur orci. Nulla ut facilisis tortor. Aenean eget tincidunt leo.</p>
</section>`;

let ipsumEl;

describe('Text Highlighter', () => {
  beforeEach(() => {
    ipsumEl = null;

    document.body.insertAdjacentHTML('afterbegin', ipsum);
    ipsumEl = document.querySelector('#main');
  });

  afterEach(() => {
    ipsumEl.parentNode.removeChild(ipsumEl);
  });

  it('can highlight parts of a text string', () => {
    $(ipsumEl).highlight('ipsum');
    const marks = ipsumEl.querySelectorAll('mark');

    expect(marks).toBeTruthy();
    expect(marks.length).toEqual(5);
  });

  it('can reset highlighted text to normal', () => {
    const $ipsumEl = $(ipsumEl);
    $ipsumEl.highlight('ipsum');
    $ipsumEl.unhighlight('ipsum');
    const marks = ipsumEl.querySelectorAll('mark');

    expect(marks).toBeTruthy();
    expect(marks.length).toEqual(0);
  });
});
