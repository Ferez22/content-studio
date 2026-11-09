import {Config} from '@remotion/cli/config';

// Brand data lives in ../brands (single source of truth). staticFile('<brand>/assets/...') resolves there.
Config.setPublicDir('../brands');
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
