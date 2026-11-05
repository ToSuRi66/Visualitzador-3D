import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

// 1. Escena 3D
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xdce5eb) // Un to clar/cel suau

// 2. Cámara
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(0, 2, 5)

// 3. Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.querySelector('#app').appendChild(renderer.domElement)

// 6. Controles de rotación con el ratón (OrbitControls)
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05

// 5. Il·luminació millorada
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2) // Llum base més potent
scene.add(ambientLight)

// Llum frontal
const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5)
dirLight1.position.set(5, 10, 7)
scene.add(dirLight1)

// Llum posterior/oposada perquè no quedi fosc per darrere
const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.0)
dirLight2.position.set(-5, -5, -5)
scene.add(dirLight2)

// --- TEXTURAS ---
const textureLoader = new THREE.TextureLoader()

// Texturas del tronco
const barkColor = textureLoader.load(import.meta.env.BASE_URL + 'mossybark02.png')
const barkNormal = textureLoader.load(import.meta.env.BASE_URL + 'mossybark02_normal.png')

barkColor.wrapS = THREE.RepeatWrapping
barkColor.wrapT = THREE.RepeatWrapping
barkNormal.wrapS = THREE.RepeatWrapping
barkNormal.wrapT = THREE.RepeatWrapping
barkColor.repeat.set(2, 6)
barkNormal.repeat.set(2, 6)

const barkMaterial = new THREE.MeshStandardMaterial({
    map: barkColor,
    normalMap: barkNormal,
    roughness: 0.9,
})

// Texturas de las hojas/ramas
const branchColor = textureLoader.load(import.meta.env.BASE_URL + 'branch05.png')
const branchNormal = textureLoader.load(import.meta.env.BASE_URL + 'branch05_normal.png')
const branchRoughness = textureLoader.load(import.meta.env.BASE_URL + 'branch05_roughness.png')

const branchMaterial = new THREE.MeshStandardMaterial({
    map: branchColor,
    normalMap: branchNormal,
    roughnessMap: branchRoughness,
    alphaTest: 0.1,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: true,
})

// --- CARGADOR DE MODELOS OBJ ---
const loader = new OBJLoader()
loader.load(
    import.meta.env.BASE_URL + 'model.obj',
    (object) => {
        object.traverse((child) => {
            if (child.isMesh) {
                if (child.name === 'tree') {
                    child.material = branchMaterial
                } else {
                    child.material = barkMaterial
                }
            }
        })

        object.position.set(0, 0, 0)
        scene.add(object)
        console.log('Modelo cargado correctamente:', object)
    },
    undefined,
    (error) => {
        console.error('Error al cargar el modelo OBJ:', error)
    }
)

// Ajuste dinámico de ventana
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

// Bucle de animación y renderizado continuo
function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
}

animate()