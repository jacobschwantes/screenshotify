import { NextPageContext, NextComponentType } from "next";
import { Config } from "@customTypes/configs";
import { RefreshIcon } from "@heroicons/react/solid";
import { Range } from "@components/index";
interface RotationProps {
  config: Config;
  updateConfig: (newConfig: Partial<Config>) => void;
}
const Rotation: NextComponentType<NextPageContext, {}, RotationProps> = ({
  config,
  updateConfig,
}) => (
  <>
    <Range
      value={config.orientation.perspective}
      set={(val) =>
        updateConfig({
          orientation: {
            ...config.orientation,
            perspective: val,
          },
        })
      }
      min={400}
      max={3000}
    >
      <div className="flex space-x-2 items-center">
        <p className=" font-medium text-zinc-300 whitespace-nowrap">
          Perspective
        </p>
        <button
          className="hover:text-zinc-400 transition-colors"
          onClick={() => {
            updateConfig({
              orientation: {
                ...config.orientation,
                perspective: 3000,
              },
            });
          }}
        >
          <RefreshIcon className="h-4" />
        </button>
      </div>
    </Range>
    <Range
      value={config.orientation.rotateX}
      set={(val) =>
        updateConfig({
          orientation: {
            ...config.orientation,
            rotateX: val,
          },
        })
      }
      min={-45}
      max={45}
    >
      <div className="flex space-x-2 items-center">
        <p className=" font-medium text-zinc-300 whitespace-nowrap">Rotate X</p>
        <button
          className="hover:text-zinc-400 transition-colors"
          onClick={() => {
            updateConfig({
              orientation: {
                ...config.orientation,
                rotateX: 0,
              },
            });
          }}
        >
          <RefreshIcon className="h-4" />
        </button>
      </div>
    </Range>
    <Range
      value={config.orientation.rotateY}
      set={(val) =>
        updateConfig({
          orientation: {
            ...config.orientation,
            rotateY: val,
          },
        })
      }
      min={-45}
      max={45}
    >
      <div className="flex space-x-2 items-center">
        <p className=" font-medium text-zinc-300 whitespace-nowrap">Rotate Y</p>
        <button
          className="hover:text-zinc-400 transition-colors"
          onClick={() => {
            updateConfig({
              orientation: {
                ...config.orientation,
                rotateY: 0,
              },
            });
          }}
        >
          <RefreshIcon className="h-4" />
        </button>
      </div>
    </Range>
    <Range
      value={config.orientation.rotateZ}
      set={(val) =>
        updateConfig({
          orientation: {
            ...config.orientation,
            rotateZ: val,
          },
        })
      }
      min={-45}
      max={45}
    >
      <div className="flex space-x-2 items-center">
        <p className=" font-medium whitespace-nowrap text-zinc-300">Rotate Z</p>
        <button
          className="hover:text-zinc-400 transition-colors"
          onClick={() => {
            updateConfig({
              orientation: {
                ...config.orientation,
                rotateZ: 0,
              },
            });
          }}
        >
          <RefreshIcon className="h-4" />
        </button>
      </div>
    </Range>
    <Range
      value={config.size.scale}
      set={(val) =>
        updateConfig({
          size: {
            ...config.size,
            scale: val,
          },
        })
      }
      min={0.5}
      max={1.5}
    >
      <div className="flex space-x-2 items-center">
        <p className=" font-medium text-zinc-300">Scale</p>
        <button
          className="hover:text-zinc-400 transition-colors"
          onClick={() => {
            updateConfig({
              size: {
                ...config.size,
                scale: 0.8,
              },
            });
          }}
        >
          <RefreshIcon className="h-4" />
        </button>
      </div>
    </Range>
    <div className="space-y-2">
      <p className=" font-medium text-zinc-300">Presets</p>
      <div className="grid grid-cols-2 gap-5">
        <button
          onClick={() => {
            updateConfig({
              size: {
                ...config.size,
                scale: 0.9,
              },
              position: {
                x: 0,
                y: 0,
              },
              orientation: {
                rotateX: 45,
                rotateY: 0,
                rotateZ: 0,
                perspective: 3000,
              },
            });
          }}
          style={{ perspective: "800px" }}
          className="border  border-zinc-800 rounded-lg flex items-center justify-center p-4  hover:border-blue-500 transition-all duration-300"
        >
          <div
            style={{ transform: "rotateX(50deg)" }}
            className="bg-zinc-600 rounded flex-1 aspect-video"
          ></div>
        </button>
        <button
          onClick={() => {
            updateConfig({
              size: {
                ...config.size,
                scale: 0.9,
              },
              position: {
                x: 0,
                y: 0,
              },
              orientation: {
                rotateX: 45,
                rotateY: 10,
                rotateZ: -35,
                perspective: 3000,
              },
            });
          }}
          style={{ perspective: "800px" }}
          className="border  border-zinc-800 rounded-lg flex items-center justify-center p-4  hover:border-blue-500 transition-all duration-300"
        >
          <div
            style={{
              transform: "rotateZ(-25deg) rotateY(30deg) rotateX(40deg)",
            }}
            className="bg-zinc-600 rounded flex-1 aspect-video  "
          ></div>
        </button>
      </div>
    </div>
    <button
      onClick={() => {
        updateConfig({
          size: {
            ...config.size,
            scale: 0.8,
          },
          position: {
            x: 0,
            y: 0,
          },
          orientation: {
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            perspective: 1500,
          },
        });
      }}
      className="flex items-center justify-center space-x-2 border border-zinc-800 text-zinc-200 bg-zinc-900 hover:bg-zinc-800 bg-opacity-25 hover:bg-opacity-25 transition-all cursor-pointer bg py-2 px-4 rounded-lg"
    >
      <RefreshIcon className="h-4 w-4" />
      <span>Reset</span>
    </button>
  </>
);
export default Rotation;