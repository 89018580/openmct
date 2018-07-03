/*****************************************************************************
 * Open MCT, Copyright (c) 2014-2018, United States Government
 * as represented by the Administrator of the National Aeronautics and Space
 * Administration. All rights reserved.
 *
 * Open MCT is licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Open MCT includes source code licensed under additional open source
 * licenses. See the Open Source Licenses file (LICENSES.md) included with
 * this source code distribution or the Licensing information page available
 * at runtime from the About dialog for additional information.
 *****************************************************************************/
define(function () {
    function TableColumn(openmct, metadatum) {
        this.openmct = openmct;
        this.metadatum = metadatum;
        this.formatter = openmct.telemetry.getValueFormatter(metadatum);
        
        this._title = this.metadatum.name;
    }

    TableColumn.prototype.title = function (title) {
        if (arguments.length > 0) {
            this._title = title;
        }
        return this._title;
    };

    TableColumn.prototype.isCurrentTimeSystem = function () {
        return this.metadatum.hints.hasOwnProperty('domain') && 
            this.metadatum.key === this.openmct.time.timeSystem().key;
    };

    TableColumn.prototype.hasValue = function (telemetryDatum) {
        return telemetryDatum.hasOwnProperty(this.metadatum.source);
    };

    TableColumn.prototype.getValue = function (telemetryDatum, limitEvaluator) {
        if (this.hasValue(telemetryDatum)) {
            var isValueColumn = !!(this.metadatum.hints.y || this.metadatum.hints.range);
            var alarm = isValueColumn &&
                        limitEvaluator &&
                        limitEvaluator.evaluate(telemetryDatum, this.metadatum);
            var value = {
                text: this.formatter.format(telemetryDatum),
                value: this.formatter.parse(telemetryDatum)
            };

            if (alarm) {
                value.cssClass = alarm.cssClass;
            }
            return value;
        } else {
            return {
                text: '',
                value: undefined
            };
        }
    };

    return TableColumn;
});