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

// Pages
import { ManifestPage } from '../manifest/manifest';

// Providers
import { RidepilotProvider } from '../../providers/ridepilot/ridepilot';

@IonicPage()
@Component({
  selector: 'page-runs',
  templateUrl: 'runs.html',
})
export class RunsPage {
  
  runs: Run[] = [];

  activeRun: Run = {} as Run;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private ridepilotProvider: RidepilotProvider) {
              this.activeRun = this.navParams.data.activeRun || {};
  }

  ionViewDidLoad() {
    this.ridepilotProvider.getRuns()
                          .subscribe((runs) => this.loadRuns(runs));
  }

  loadRuns(runs: Run[]) {
    this.runs = runs || [];
    if(!this.hasActiveRun()) {
      this.activeRun = this.runs.find(r => !r.complete) || ({} as Run);
    }
  }

  setActiveRun(run: Run) {
    this.activeRun = run;
  }

  checkIfActiveRun(run: Run) {
    return this.hasActiveRun() && (run === this.activeRun || run.id == this.activeRun.id);
  }

  hasActiveRun() {
    return this.activeRun && this.activeRun.id;
  }

  loadManifest() {
    this.navCtrl.setRoot(ManifestPage, {run: this.activeRun});
  }

}
