#!/bin/bash

echo "🔧 Creating virtual environment..."
python3 -m venv venv

echo "📦 Activating virtual environment..."
source venv/bin/activate

echo "📄 Creating requirements.txt..."
cat <<EOF > requirements.txt
selenium
webdriver-manager
schedule
EOF

echo "⬇️ Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Setup complete!"
echo "To activate the virtual environment later, run: source venv/bin/activate"
