import Navbar from "../components/navbar";

function AboutPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background pattern layers - consistent with other pages */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>
      <div className="fixed inset-0 bg-black opacity-50 z-10"></div>

      <Navbar />

      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 md:pt-28">
        {" "}
        {/* Adjust pt-X for Navbar height */}
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-sky-400 via-cyan-400 to-indigo-500 bg-clip-text text-transparent mb-4">
            About MushroomAI Classifier 🍄
          </h1>
        </header>
        <div className="max-w-4xl mx-auto space-y-10 md:space-y-12">
          <section className="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
              The Mission: Unveiling the World of Fungi, Responsibly
            </h2>
            <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
              Welcome to the AI Mushroom Classifier! Have you ever been on a
              walk and wondered about the fascinating fungi diversity around
              you? My mission is to make mushroom identification a little more
              accessible and engaging for everyone, from curious hikers to
              budding mycologists. This tool uses the power of Artificial
              Intelligence to help you get a preliminary idea of what mushroom
              species you might have found, all from a simple photo. It aims to
              provide quick, AI-driven insights into 100 different mushroom
              species based on visual data.
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
              How It Works: A Peek Behind the Curtain
            </h2>
            <div className="text-gray-300 leading-relaxed text-base sm:text-lg space-y-3">
              <p>
                It's a blend of user-friendly design and powerful artificial
                intelligence:
              </p>
              <ol className="list-decimal list-inside space-y-2 pl-4">
                <li>
                  You{" "}
                  <strong className="text-green-400">
                    upload a clear photo
                  </strong>{" "}
                  of a mushroom through the intuitive interface.
                </li>
                <li>
                  The app sends the image to its "AI brain" – a sophisticated
                  computer model on the backend.
                </li>
                <li>
                  The AI analyzes the visual features of your mushroom using a
                  Convolutional Neural Network (CNN).
                </li>
                <li>
                  Within moments, you'll see the top potential matches along
                  with how confident the AI is in each guess. You can then
                  explore the Species Guide for more detailed information on any
                  of the 100 classifiable species.
                </li>
              </ol>
            </div>
          </section>

          <section className="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
              The AI Model & Your Safety{" "}
              <span className="text-red-500">(Important!)</span>
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed text-base sm:text-lg">
              <p>
                <strong className="text-sky-300">Technology:</strong> Built
                using TensorFlow/Keras, it leverages transfer learning with
                MobileNetV2 as its foundation, enhanced with custom layers
                (GlobalAveragePooling2D, BatchNormalization, Dense, Dropout) to
                specialize in mushroom identification.
              </p>
              <p>
                <strong className="text-sky-300">Training Data:</strong> The
                model was meticulously trained on a comprehensive dataset from
                Kaggle, featuring thousands of images across{" "}
                <strong className="text-white">
                  100 different mushroom species
                </strong>
                .
              </p>
              <p>
                <strong className="text-sky-300">Learning Process:</strong> We
                employed data augmentation techniques (like RandomFlip,
                RandomRotation, RandomZoom) and smart training strategies like
                `EarlyStopping` and `ReduceLROnPlateau` to make the model as
                robust as possible.
              </p>
              <p>
                <strong className="text-sky-300">Performance:</strong> It
                currently achieves approximately{" "}
                <strong className="text-white">80% accuracy</strong> on the test
                set for these 100 species. However, image quality, lighting, and
                angle can affect performance.
              </p>
              <div className="mt-6 bg-red-500/20 border-l-4 border-red-500 p-4 rounded-md">
                <h3 className="text-xl font-semibold text-red-300 mb-2">
                  ⚠️ CRITICAL SAFETY WARNING
                </h3>
                <p className="text-red-200">
                  This tool is designed for{" "}
                  <strong className="text-red-100">
                    educational and informational purposes ONLY
                  </strong>
                  . It is a preliminary identification aid.{" "}
                  <strong className="text-red-100">
                    NEVER rely solely on this app (or any app) to determine if a
                    mushroom is edible.
                  </strong>{" "}
                  Misidentification can have severe or even fatal consequences.
                  Always consult with experienced local mycologists and
                  cross-reference with multiple reputable field guides before
                  considering any wild mushroom for consumption. When in doubt,
                  leave it untouched!
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
              Who Is This Tool For?
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300 leading-relaxed text-base sm:text-lg pl-4">
              <li>
                Nature enthusiasts and hikers curious about their fungal finds.
              </li>
              <li>
                Amateur mycologists and students looking for a supplementary
                learning tool.
              </li>
              <li>
                Anyone interested in the intersection of technology and the
                natural world.
              </li>
            </ul>
          </section>

          <section className="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
              The Technology Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300 text-base sm:text-lg">
              <div>
                <h3 className="text-xl font-semibold text-sky-300 mb-2">
                  Frontend
                </h3>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  <li>React</li>
                  <li>Tailwind CSS</li>
                  <li>Lucide React (for icons)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-sky-300 mb-2">
                  Backend & AI
                </h3>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  <li>Python (Flask framework)</li>
                  <li>TensorFlow & Keras (for the AI model)</li>
                  <li>Pillow, NumPy (for image processing)</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
              About the Creator
            </h2>
            <p className="text-gray-300 leading-relaxed text-base sm:text-lg mb-3">
              This AI Mushroom Classifier was developed by{" "}
              <strong className="text-white">Devansh Kapoor</strong>.
            </p>

            <div className="space-x-4">
              <a
                href="https://linkedin.com/in/devansh-kapoor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                Connect on LinkedIn
              </a>
              <span className="text-gray-500">|</span>
              <a
                href="mailto:devansh.kp@outlook.com"
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                Email: devansh.kp@outlook.com
              </a>
            </div>
          </section>

          <section className="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
              What's Next?
            </h2>
            <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
              I'm always thinking about how to improve MushroomAI! Some ideas
              for the future include an option to provide feedback on
              predictions to help the AI learn even more, and perhaps a feature
              to cache your classification history.
            </p>
          </section>
        </div>
        <footer className="text-center mt-16 pt-8 border-t border-white/20">
          <p className="text-gray-400 text-sm">
            Enjoy exploring the world of mushrooms, and please remember to
            always prioritize safety and expert verification!
          </p>
        </footer>
      </div>
    </div>
  );
}

export default AboutPage;
