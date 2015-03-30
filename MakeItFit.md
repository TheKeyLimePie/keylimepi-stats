<h2>Things you have to pay attention to when using this web interface:</h2>
<ul>
  <li>Download Chart.js (GitHub link in the README file) to <b>chart/</b> (I hope you know how to mkdir)</li>
  <li>Download speedtest-cli (GitHub link in the README file) to e.g. your home directory</li>
  <li>Edit the <i>background-</i> attributes of <i>#temperature</i> in <b>css/common.css</b> or delete them</li>
  <li>
    <b>stats.php</b>
    <ul>
      <li>The CPU stats are optimised for a four core CPU</li>
      <li>The network stats should work fine on any linux device</li>
      <li>The root disk and SDA1 stats are tailored to my particular needs. Edit them to your needs.</li>
      <li>RAM and temperature stats should also work fine.</li>
      <li>Anyway, you should make sure that every command executed by this php script works on your device!</li>
    </ul>
  </li>
  <li>
    <b>dsl/index.php</b><br/>
    <ul>
      <li>
        First of all you should create a cronjob which executes <b>speedtest.sh</b>. Make sure that all paths in this file are correct. Modify them when necessary.
      </li>
      <li>
        Now we create the symlink <i>speedlog.txt</i> in <b>dsl/</b>. It refers to your speedlog.txt mentioned in <b>speedtest.sh</b>.
      </li>
    </ul>
  </li>
  <li>When modifying these stats make sure that Chart.js handles the new data properly so take a closer look on <b>js/scripts.js</b></li>
  <li>Edit the HTML (e.g. edit, remove, add charts)</li>
  <li>Make sure that this interface is accessible in your local network only so edit your web server configuration!</li>
</ul>
