import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dev-team',
  templateUrl: './dev-team.component.html',
  styleUrls: ['./dev-team.component.css']
})
export class DevTeamComponent implements OnInit {

  developers = [
    {
      name: 'Shubhendu Verma (TL)',
      email: 'shubhendu.verma@LTIMindtree.com',
      psNumber: 10834165,
      topics:'Integration & Implementation, Support',
      avatar: 'assets/shubhendu.jpg'
    },
    {
      name: 'Vidushi Gupta',
      email: 'vidushi.gupta@LTIMindtree.com',
      psNumber: 10834225,
      topics: 'JWT Authentication, Form Validation',
      avatar: 'assets/vidushi.jpg'
    },
    {
      name: 'Yash Sinha',
      email: 'yash.sinha2@LTIMindtree.com',
      psNumber: 10834233,
      topics: 'Angular AuthGuard & AuthService, Designing ',
      avatar: 'assets/me.jpg'
    },
    {
      name: 'Ashish Kumar',
      email: 'ashish.kumar@LTIMindtree.com',
      psNumber: 10834090,
      topics: 'Data Research, Frontend Implimentation',
      avatar: 'assets/ashish.jpg'
    },
    {
      name: 'Aviral Gautam',
      email: 'aviral.gautam@LTIMindtree.com',
      psNumber: 10834103,
      topics: 'API Integration, .NET Core APIs',
      avatar: 'assets/aviral.jpg'
    },
    {
      name: 'Shanker Tarun Aditya',
      email: 'shanker.aditya@LTIMindtree.com',
      psNumber: 10834198,
      topics: 'Designing, Frontend Implimentation',
      avatar: 'assets/tarun.jpg'
    }
    
  ];

  constructor() { }

  ngOnInit(): void {
  }

}


