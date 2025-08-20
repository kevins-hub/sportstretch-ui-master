import React from 'react';
import { render } from '@testing-library/react-native';
import TermsAndConditions from '../../../app/components/shared/TermsAndConditions';

describe('TermsAndConditions', () => {
  it('should render without crashing', () => {
    expect(() => render(<TermsAndConditions />)).not.toThrow();
  });

  it('should render main title text', () => {
    const { getByText } = render(<TermsAndConditions />);
    
    expect(getByText(/THESE TERMS OF USE/i)).toBeTruthy();
    expect(getByText(/SPORTSTRETCH USA, INC/i)).toBeTruthy();
  });

  it('should render arbitration notice', () => {
    const { getByText } = render(<TermsAndConditions />);
    
    expect(getByText(/ARBITRATION ON AN INDIVIDUAL BASIS/i)).toBeTruthy();
  });

  it('should render section titles', () => {
    const { getByText } = render(<TermsAndConditions />);
    
    expect(getByText(/1. Use of Web Site/i)).toBeTruthy();
    expect(getByText(/2. Registration, Accounts/i)).toBeTruthy();
    expect(getByText(/3. Your Responsibilities/i)).toBeTruthy();
    expect(getByText(/4. Medical-Related Disclaimers/i)).toBeTruthy();
  });

  it('should render medical emergency notice', () => {
    const { getByText } = render(<TermsAndConditions />);
    
    expect(getByText(/NOT INTENDED FOR MEDICAL EMERGENCIES/i)).toBeTruthy();
    expect(getByText(/DIAL "911" IMMEDIATELY/i)).toBeTruthy();
  });

  it('should render refund policy', () => {
    const { getAllByText } = render(<TermsAndConditions />);
    
    const refundTexts = getAllByText(/SPORTSTRETCH will not refund you for any reason/i);
    expect(refundTexts.length).toBeGreaterThan(0);
  });

  it('should render contact information', () => {
    const { getAllByText } = render(<TermsAndConditions />);
    
    const emailTexts = getAllByText(/sportstretchapp@gmail.com/i);
    expect(emailTexts.length).toBeGreaterThan(0);
  });

  it('should render age requirement', () => {
    const { getByText } = render(<TermsAndConditions />);
    
    expect(getByText(/eighteen \(18\) years of age/i)).toBeTruthy();
  });

  it('should display warranty disclaimers', () => {
    const { getAllByText } = render(<TermsAndConditions />);
    
    const warrantyTexts = getAllByText(/WARRANTIES OF MERCHANTABILITY/i);
    expect(warrantyTexts.length).toBeGreaterThan(0);
    const asIsTexts = getAllByText(/PROVIDED.*AS IS/i);
    expect(asIsTexts.length).toBeGreaterThan(0);
  });

  it('should render dispute resolution section', () => {
    const { getByText, getAllByText } = render(<TermsAndConditions />);
    
    expect(getByText(/20. Dispute Resolution/i)).toBeTruthy();
    const arbitrationTexts = getAllByText(/Mandatory Arbitration/i);
    expect(arbitrationTexts.length).toBeGreaterThan(0);
  });

  it('should render governing law', () => {
    const { getByText } = render(<TermsAndConditions />);
    
    expect(getByText(/laws of the State of New York/i)).toBeTruthy();
  });

  it('should render Apple notice section', () => {
    const { getByText } = render(<TermsAndConditions />);
    
    expect(getByText(/NOTICE REGARDING APPLE/i)).toBeTruthy();
  });
});
