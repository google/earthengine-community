import { Panel } from '../../widgets/ui-panel/ui-panel';
import { Map } from '../../widgets/ui-map/ui-map';
import { Label } from '../../widgets/ui-label/ui-label';
import { Button } from '../../widgets/ui-button/ui-button';
import { Slider } from '../../widgets/ui-slider/ui-slider';
import { Select } from '../../widgets/ui-select/ui-select';
import { Textbox } from '../../widgets/ui-textbox/ui-textbox';
import { Checkbox } from '../../widgets/ui-checkbox/ui-checkbox';
import { Chart } from '../../widgets/ui-chart/ui-chart';

export type EEWidget =
  | Panel
  | Map
  | Label
  | Button
  | Slider
  | Select
  | Textbox
  | Checkbox
  | Chart;
