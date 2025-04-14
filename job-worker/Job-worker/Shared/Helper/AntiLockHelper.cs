using System.Runtime.InteropServices;

namespace Job_worker.Shared.Helper
{
    public class AntiLockHelper
    {
        // Structure for mouse input
        [StructLayout(LayoutKind.Sequential)]
        public struct INPUT
        {
            public uint type;
            public MOUSEINPUT mi;
        }

        // Structure for mouse input data
        [StructLayout(LayoutKind.Sequential)]
        public struct MOUSEINPUT
        {
            public int dx;
            public int dy;
            public uint mouseData;
            public uint dwFlags;
            public uint time;
            public IntPtr dwExtraInfo;
        }

        // Constants for mouse events
        public const uint MOUSEEVENTF_MOVE = 0x0001;

        // Import SendInput function from user32.dll
        [DllImport("user32.dll", SetLastError = true)]
        public static extern uint SendInput(uint nInputs, INPUT[] pInputs, int cbSize);

        public bool DisableLock { get; set; }

        // Method to simulate mouse movement to avoid lock
        public void AvoidLock()
        {
            if (DisableLock) return;

            try
            {
                // Get the current position of the mouse (will be moved by 1px)
                var currentPosition = GetCursorPosition();

                // Simulate slight mouse movement
                MoveMouse(currentPosition.X + 1, currentPosition.Y + 1);
                MoveMouse(currentPosition.X, currentPosition.Y);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to simulate anti-lock activity: {ex.Message}");
            }
        }

        // Function to get the current mouse position
        public (int X, int Y) GetCursorPosition()
        {
            var point = new POINT();
            if (GetCursorPos(ref point))
            {
                return (point.X, point.Y);
            }
            throw new InvalidOperationException("Unable to get cursor position");
        }

        // Function to move the mouse to a specific location
        private void MoveMouse(int x, int y)
        {
            var input = new INPUT
            {
                type = 0, // MOUSE input
                mi = new MOUSEINPUT
                {
                    dx = x,
                    dy = y,
                    mouseData = 0,
                    dwFlags = MOUSEEVENTF_MOVE,
                    time = 0,
                    dwExtraInfo = IntPtr.Zero
                }
            };

            // Send input to simulate mouse move
            SendInput(1, new[] { input }, Marshal.SizeOf(typeof(INPUT)));
        }

        // Import GetCursorPos function from user32.dll
        [DllImport("user32.dll")]
        public static extern bool GetCursorPos(ref POINT lpPoint);

        // Structure to hold the cursor position
        public struct POINT
        {
            public int X;
            public int Y;
        }
    }
}
