import './style.css'
import 'bulma/css/bulma.min.css'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item has-text-weight-bold is-size-4">
        Favicon Maker
      </a>
    </div>
  </nav>

  <section class="section">
    <div class="container">
      <div class="columns is-gapless">
        <div class="column is-half">
          <div class="upload-area" id="uploadArea">
            <div class="upload-placeholder">
              <span class="icon is-large">
                <i class="fas fa-cloud-upload-alt fa-2x"></i>
              </span>
              <p class="is-size-5 has-text-grey-dark">画像を選択してください</p>
              <p class="is-size-6 has-text-grey">クリックまたはドラッグ&ドロップ</p>
              <input type="file" id="fileInput" accept="image/*" style="display: none;">
            </div>
          </div>
        </div>
        
        <div class="column is-half">
          <div class="preview-grid">
            <div class="preview-item" data-size="256">
              <div class="preview-placeholder">
                <span class="preview-size">256×256</span>
                <span class="icon">
                  <i class="fas fa-times"></i>
                </span>
              </div>
            </div>
            <div class="preview-item" data-size="128">
              <div class="preview-placeholder">
                <span class="preview-size">128×128</span>
                <span class="icon">
                  <i class="fas fa-times"></i>
                </span>
              </div>
            </div>
            <div class="preview-item" data-size="64">
              <div class="preview-placeholder">
                <span class="preview-size">64×64</span>
                <span class="icon">
                  <i class="fas fa-times"></i>
                </span>
              </div>
            </div>
            <div class="preview-item" data-size="32">
              <div class="preview-placeholder">
                <span class="preview-size">32×32</span>
                <span class="icon">
                  <i class="fas fa-times"></i>
                </span>
              </div>
            </div>
            <div class="preview-item" data-size="16">
              <div class="preview-placeholder">
                <span class="preview-size">16×16</span>
                <span class="icon">
                  <i class="fas fa-times"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Crop Modal -->
  <div class="modal" id="cropModal">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">画像をトリミング</p>
        <button class="delete" aria-label="close" id="closeCropModal"></button>
      </header>
      <section class="modal-card-body">
        <div class="crop-container">
          <canvas id="cropCanvas"></canvas>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" id="applyCrop">適用</button>
        <button class="button" id="cancelCrop">キャンセル</button>
      </footer>
    </div>
  </div>
`