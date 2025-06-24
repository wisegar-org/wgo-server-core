export interface IPoll {
  textBanner: {
    text: string;
    clickText: string;
  };
  textBannerReedme: {
    title: string;
    text: string;
    description: string;
    clickText: string;
  };
  textEmail: {
    header: string;
    footer: string;
  };
  textLink: {
    text: string;
    clickText: string;
  };
  header: {
    title: string;
    address: string;
    email: string;
    subject: string;
  };
  content: {
    description: string;
    parting: string;
  };
  labels: {
    childGroup: string;
    parentGroup: string;
    yesOrNoHolder: string;
    email: string;
    name: string;
    class: string;
    photo: string;
    photoHelp: string;
    allergy: string;
    foodAllergy: string;
    intolerance: string;
    foodIntolerance: string;
    parentName: string;
    parentEmail: string;
    phone: string;
    disposition: string;
    interest: string;
    send: string;
  };
  options: {
    yesOrNo: string[];
    class: string[];
  };
}

export interface IFormPoll {
  email: string;
  name: string;
  class: string;
  photo: string;
  allergy: string;
  foodAllergy: string;
  intolerance: string;
  foodIntolerance: string;
  parentName: string;
  parentEmail: string;
  phone: string;
  disposition: string;
  interest: string;
}
