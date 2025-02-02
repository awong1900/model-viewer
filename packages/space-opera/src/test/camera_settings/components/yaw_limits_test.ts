/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */


import '../../../components/camera_settings/components/yaw_limits.js';

import {YawLimits} from '../../../components/camera_settings/components/yaw_limits.js';
import {dispatchYawLimits, getCamera} from '../../../components/camera_settings/reducer.js';
import {ModelViewerPreview} from '../../../components/model_viewer_preview/model_viewer_preview.js';
import {getModelViewer} from '../../../components/model_viewer_preview/reducer.js';
import {dispatchReset} from '../../../reducers.js';
import {reduxStore} from '../../../space_opera_base.js';
import {rafPasses} from '../../utils/test_utils.js';

describe('yaw limits editor test', () => {
  let yawLimitsDeg: YawLimits;
  let preview: ModelViewerPreview;

  beforeEach(async () => {
    reduxStore.dispatch(dispatchReset());
    preview = new ModelViewerPreview();
    document.body.appendChild(preview);
    await preview.updateComplete;

    yawLimitsDeg = new YawLimits();
    document.body.appendChild(yawLimitsDeg);
    dispatchYawLimits({enabled: false, min: 0, max: 0});
    await yawLimitsDeg.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(yawLimitsDeg);
    document.body.removeChild(preview);
  });

  it('correctly loads yaw limits', async () => {
    reduxStore.dispatch(dispatchYawLimits({enabled: true, min: 12, max: 34}));
    await yawLimitsDeg.updateComplete;
    expect(yawLimitsDeg.inputLimits.enabled).toEqual(true);
    expect(yawLimitsDeg.inputLimits.min).toEqual(12);
    expect(yawLimitsDeg.inputLimits.max).toEqual(34);
  });

  it('correctly dispatches when I click set', async () => {
    reduxStore.dispatch(dispatchYawLimits({enabled: true, min: 0, max: 99}));
    const modelViewer = getModelViewer()!;
    modelViewer.cameraOrbit = '33deg auto auto';
    modelViewer.jumpCameraToGoal();
    await rafPasses();
    await yawLimitsDeg.updateComplete;

    (yawLimitsDeg.shadowRoot!.querySelector('#set-max-button')! as
     HTMLInputElement)
        .click();
    await yawLimitsDeg.updateComplete;
    expect(getCamera(reduxStore.getState()).yawLimitsDeg!.max).toEqual(33);
  });
});
