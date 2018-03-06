import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RunsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// Models
import { Run } from '../../models/run';

// Providers
import { RidepilotProvider } from '../../providers/ridepilot/ridepilot';

@IonicPage()
@Component({
  selector: 'page-runs',
  templateUrl: 'runs.html',
})
export class RunsPage {
  
  runs: Run[] = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private ridepilotProvider: RidepilotProvider) {
  }

  ionViewDidLoad() {
    this.ridepilotProvider.getRuns()
                          .subscribe((runs) => 
                            this.runs = runs
                          );
  }

}