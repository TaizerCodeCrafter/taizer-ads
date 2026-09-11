import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Taizer Ads Uncaught ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#1e293b] border border-gray-700/80 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-rose-500/20 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-black tracking-tight text-white">
                යම් දෝෂයක් සිදුවිය (Something went wrong)
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                පද්ධතියේ කුඩා දෝෂයක් නිසා පිටුව පෙන්වීමට නොහැකි විය. පහත බොත්තම ඔබා නැවත මුල් පිටුවට පිවිසෙන්න.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-black/40 border border-gray-800 rounded-xl p-3 text-left overflow-x-auto text-[11px] font-mono text-rose-300/90 max-h-28">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-md active:scale-95 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>මුල් පිටුවට යන්න (Go to Home)</span>
              </button>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full py-2.5 px-4 bg-gray-700 hover:bg-gray-600 text-gray-200 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
